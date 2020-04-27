require('dotenv').config()

const { SENDGRID_USERNAME, SENDGRID_PASSWORD, CONTACT_EMAIL } = process.env

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { createTransport } = require('nodemailer')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.post('/mailing', mailing)
app.post('/campaign', campaign)

const transportConfig = {
  service: 'SendGrid',
  auth: {
    user: SENDGRID_USERNAME,
    pass: SENDGRID_PASSWORD,
  },
}

function mailing(req, res, next) {
  const { name, email, text } = req.body

  const mailConfig = {
    from: `"${name}" <${email}>`,
    to: CONTACT_EMAIL,
    subject: '🚀 MM Devs | Someone asked for help 🚀',
    text,
  }

  createTransport(transportConfig)
    .sendMail(mailConfig)
    .then((info) => res.status(200).json(info))
    .catch((err) => res.status(500).json(err))
}

function campaign(req, res, next) {
  const { companyName, name, email, phone } = req.body

  const mailConfig = {
    from: `"${name} - ${phone}" <${email}>`,
    to: CONTACT_EMAIL,
    subject: '🚀 MM Devs | Someone asked for help 🚀 | Campaign',
    text: `${name} reach us through the campaign Home Workout, the contact number is ${phone} `,
  }

  createTransport(transportConfig)
    .sendMail(mailConfig)
    .then((info) => res.status(200).json(info))
    .catch((err) => res.status(500).json(err))
}

app.listen(process.env.PORT)
