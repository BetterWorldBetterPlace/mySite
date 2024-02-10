import "./chunk-ROME4SDB.js";

// node_modules/emailjs-com/es/store/store.js
var store = {
  _origin: "https://api.emailjs.com"
};

// node_modules/emailjs-com/es/methods/init/init.js
var init = (userID, origin = "https://api.emailjs.com") => {
  store._userID = userID;
  store._origin = origin;
};

// node_modules/emailjs-com/es/utils/validateParams.js
var validateParams = (userID, serviceID, templateID) => {
  if (!userID) {
    throw "The user ID is required. Visit https://dashboard.emailjs.com/admin/integration";
  }
  if (!serviceID) {
    throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
  }
  if (!templateID) {
    throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";
  }
  return true;
};

// node_modules/emailjs-com/es/models/EmailJSResponseStatus.js
var EmailJSResponseStatus = class {
  constructor(httpResponse) {
    this.status = httpResponse.status;
    this.text = httpResponse.responseText;
  }
};

// node_modules/emailjs-com/es/api/sendPost.js
var sendPost = (url, data, headers = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", ({ target }) => {
      const responseStatus = new EmailJSResponseStatus(target);
      if (responseStatus.status === 200 || responseStatus.text === "OK") {
        resolve(responseStatus);
      } else {
        reject(responseStatus);
      }
    });
    xhr.addEventListener("error", ({ target }) => {
      reject(new EmailJSResponseStatus(target));
    });
    xhr.open("POST", store._origin + url, true);
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.send(data);
  });
};

// node_modules/emailjs-com/es/methods/send/send.js
var send = (serviceID, templateID, templatePrams, userID) => {
  const uID = userID || store._userID;
  validateParams(uID, serviceID, templateID);
  const params = {
    lib_version: "3.2.0",
    user_id: uID,
    service_id: serviceID,
    template_id: templateID,
    template_params: templatePrams
  };
  return sendPost("/api/v1.0/email/send", JSON.stringify(params), {
    "Content-type": "application/json"
  });
};

// node_modules/emailjs-com/es/methods/sendForm/sendForm.js
var findHTMLForm = (form) => {
  let currentForm;
  if (typeof form === "string") {
    currentForm = document.querySelector(form);
  } else {
    currentForm = form;
  }
  if (!currentForm || currentForm.nodeName !== "FORM") {
    throw "The 3rd parameter is expected to be the HTML form element or the style selector of form";
  }
  return currentForm;
};
var sendForm = (serviceID, templateID, form, userID) => {
  const uID = userID || store._userID;
  const currentForm = findHTMLForm(form);
  validateParams(uID, serviceID, templateID);
  const formData = new FormData(currentForm);
  formData.append("lib_version", "3.2.0");
  formData.append("service_id", serviceID);
  formData.append("template_id", templateID);
  formData.append("user_id", uID);
  return sendPost("/api/v1.0/email/send-form", formData);
};

// node_modules/emailjs-com/es/index.js
var es_default = {
  init,
  send,
  sendForm
};
export {
  es_default as default,
  init,
  send,
  sendForm
};
//# sourceMappingURL=emailjs-com.js.map
