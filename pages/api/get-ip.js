// pages/api/get-ip.js
export default function handler(req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
  
    res.status(200).json({ ip });
  }
  