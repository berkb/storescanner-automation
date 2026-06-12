/**
 * render-server.mjs — Local HTTP server for n8n to trigger renders
 *
 * Start:  node scripts/render-server.mjs
 * Port:   3456
 *
 * POST /render   { headline, points, cta, ctaUrl }
 * → { outputPath }  (after render completes, may take several minutes)
 */

import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PORT = 3456;

function runScript(args, res) {
  let stdout = '';
  let stderr = '';
  const proc = spawn('node', args, { cwd: ROOT });
  proc.stdout.on('data', d => { stdout += d; process.stdout.write(d); });
  proc.stderr.on('data', d => { stderr += d; process.stderr.write(d); });
  proc.on('close', code => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ exitCode: code, stdout, stderr }));
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/weekly') {
    console.log('[render-server] Starting weekly-generate.mjs');
    runScript(['scripts/weekly-generate.mjs'], res);
    return;
  }

  if (req.method === 'POST' && req.url === '/publish') {
    console.log('[render-server] Starting publish-week.mjs');
    runScript(['scripts/publish-week.mjs'], res);
    return;
  }

  if (req.method === 'POST' && req.url === '/daily') {
    console.log('[render-server] Starting daily-generate.mjs');
    runScript(['scripts/daily-generate.mjs'], res);
    return;
  }

  if (req.method === 'POST' && req.url === '/publish-daily') {
    console.log('[render-server] Starting publish-daily.mjs');
    runScript(['scripts/publish-daily.mjs'], res);
    return;
  }

  if (req.method !== 'POST' || req.url !== '/render') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'POST /render | /weekly | /publish only' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let props;
    try {
      props = JSON.parse(body);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }

    const propsFile = path.join('/tmp', `video-props-${Date.now()}.json`);
    const outputPath = path.join(ROOT, 'out', `video_${Date.now()}.mp4`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(propsFile, JSON.stringify(props));

    console.log(`[render-server] Starting render → ${outputPath}`);

    const proc = spawn('node', [
      'scripts/render.mjs',
      `--propsFile=${propsFile}`,
      `--out=${outputPath}`,
    ], { cwd: ROOT, stdio: 'inherit' });

    proc.on('close', code => {
      fs.rmSync(propsFile, { force: true });
      if (code === 0 && fs.existsSync(outputPath)) {
        console.log(`[render-server] Done: ${outputPath}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ outputPath }));
      } else {
        const msg = `Render process exited with code ${code}`;
        console.error(`[render-server] ${msg}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: msg }));
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[render-server] Listening on http://127.0.0.1:${PORT}`);
});
