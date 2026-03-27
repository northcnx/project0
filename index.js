// ไฟล์นี้คือ Startup File (ไฟล์เปิดเซิฟเวอร์หลัก)
// ใช้สำหรับตั้งค่าในโฮสติ้งจำพวก cPanel, Plesk หรืองานที่ต้องชี้ให้รันไฟล์ .js เพื่อเปิดระบบ
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
// เพื่อกันการล่มจากการนำชื่อโดเมนมาใส่ผิดที่ กรุณาปล่อยให้เป็น '0.0.0.0' เพื่อรันผ่านทุก Network Interface แบบสากล
const hostname = '0.0.0.0'
const port = process.env.PORT || 3000

// เมื่อรันไฟล์นี้ ระบบ Next.js จะถูกปลุกให้ทำงาน
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
