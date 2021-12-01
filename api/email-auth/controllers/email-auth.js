const From = process.env.EMAIL_ADDRESS_FROM;
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
var appDir = path.dirname(require.main.filename);
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
module.exports = {
  async create(ctx, res) {
    const { email } = ctx.request.body;
    const { type } = ctx.request.body;
    const vaildCheck = email.indexOf("@");
    if (!email || email.length === 0 || vaildCheck === -1) {
      return "잘못된 이메일 형식입니다.";
    }
    const isUser = await strapi
      .query("user", "users-permissions")
      .findOne({ email: email });
    if (isUser && type === "signup") {
      return "이미 회원가입된 이메일입니다.";
    }

    if (!isUser && type === "find") {
      return "이메일 정보가 없습니다.";
    }

    //* 랜덤 문자열 생성
    let code = String(Math.floor(Math.random() * 100000));
    strapi.services.sendmail.send(
      From,
      email,
      "빅데이터 플랫폼 인증 코드",
      `인증코드는 ${code}입니다. 유효 시간은 3분입니다.`
    );
    await strapi.query("email-auth").create({ code, isAuth: false });
    //* 10분 동안 입력하지 않으면 데이터 파괴
    setTimeout(async () => {
      if (strapi.query("email-auth").findOne({ code })) {
        await strapi
          .query("email-auth")
          .findOne({ code })
          .then(async (data) => {
            if (data.isAuth === false) {
              await strapi.query("email-auth").delete({ code });
              return;
            } else {
              await strapi.query("email-auth").update({ code: null });
            }
          });
      }
    }, 1000 * 60 * 3);
  },
};

// let entity;
// if (ctx.is("multipart")) {
//   const { data, files } = parseMultipartData(ctx);
//   entity = await strapi.services.email.create(data, { files });
// } else {
//   entity = await strapi.services.email.create(ctx.request.body);
// }
// sanitizeEntity(entity, { model: strapi.models.email });
