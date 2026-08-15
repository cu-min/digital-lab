// send-email.js — 使用 nodemailer 发送"网页已上线"邮件。
// 运行：
//   node .\send-email.js --from 你的邮箱@163.com --code 你的SMTP授权码
//   (可选 --to 指定收件邮箱，默认 18118863756@163.com)
//
// ⚠️ 发件邮箱（尤其 163/QQ）必须先在网页邮箱设置里开启 SMTP 服务，
//    并获取"授权码"，用 --code 传入。163 在 设置->POP3/SMTP/IMAP。 
const nodemailer = require('nodemailer');

function arg(name) {
  const i = process.argv.indexOf('--' + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const FROM = arg('from');
const CODE = arg('code');
const TO = (arg('to') || '18118863756@163.com').trim();
const URL = 'https://cu-min.github.io/digital-lab/';

if (!FROM || !CODE) {
  console.error('缺少发件邮箱或SMTP授权码。用法：');
  console.error('  node send-email.js --from 你的邮箱@xx.com --code 你的SMTP授权码');
  console.error('163邮箱：设置 -> 开启SMTP -> 短信获取授权码。');
  process.exit(1);
}

const host = FROM.split('@')[1];
const secure = host === '163.com' || host === 'qq.com'; // 465 端口

const transporter = nodemailer.createTransport({
  host: 'smtp.' + host,
  port: secure ? 465 : 587,
  secure,
  auth: { user: FROM, pass: CODE },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

const subject = '你的 Digital Lab 网页已上线 🎉';
const text =
  '你好！\n\n' +
  '你请求创建的交互式网页（数字现代化风格）已上线并部署完毕。\n\n' +
  '🔗 访问链接：' + URL + '\n' +
  '📦 源码仓库：https://github.com/cu-min/digital-lab\n\n' +
  '页面功能：实时时钟 · 深浅色主题切换 · 交互计数器 · 能量进度条 · 模拟遥测数据\n' +
  '由 DeepSeek Harness 自动生成并部署到 GitHub Pages。\n\n' +
  '— Digital Lab';

transporter.sendMail({
  from: FROM,
  to: TO,
  subject,
  text,
}).then(info => {
  console.log('✅ 邮件已发送，messageId:', info.messageId);
}).catch(err => {
  console.error('❌ 发送失败：');
  console.error(err.message);
  if (err.message.includes('auth')) {
    console.error('提示：-code SMTP授权码 不正确，或该邮箱尚未开启 SMTP 服务。');
  }
  process.exit(1);
});
