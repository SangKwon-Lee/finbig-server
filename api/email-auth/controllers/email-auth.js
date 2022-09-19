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
    const { email, type } = ctx.request.body;

    let isUser = {
      email: "",
      isDeleted: false,
    };

    try {
      const userData = await strapi
        .query("user", "users-permissions")
        .findOne({ email: email });
      if (userData) {
        isUser = userData;
      }
    } catch (e) {
      console.log(e);
    }

    if (isUser.email.length > 0 && type === "signup") {
      ctx.resonse.code === 200;
      return "중복된 이메일 입니다.";
    }

    if (isUser.email.length === 0 && type === "find") {
      ctx.resonse.code === 200;
      return "이메일 정보가 없습니다.";
    }

    if (isUser.isDeleted && type === "find") {
      ctx.resonse.code === 200;
      return isUser;
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

    //* 3분 동안 입력하지 않으면 데이터 파괴
    setTimeout(async () => {
      if (strapi.query("email-auth").findOne({ code })) {
        await strapi.query("email-auth").delete({ code });
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
