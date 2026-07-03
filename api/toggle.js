let logs = {};

export default function handler(req, res) {
  const app = req.query.app;
  
  if (!app) {
    return res.status(200).json({ error: 'no app name' });
  }
  
  if (!logs[app]) logs[app] = { status: 'close', history: [] };
  
  logs[app].status = logs[app].status === 'open' ? 'close' : 'open';
  logs[app].history.push({
    action: logs[app].status,
    time: new Date().toISOString()
  });
  
  // 只保留最近24小时
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  Object.keys(logs).forEach(key => {
    logs[key].history = logs[key].history.filter(h => new Date(h.time).getTime() > cutoff);
  });
  
  res.status(200).json({ ok: true, app, status: logs[app].status });
}
