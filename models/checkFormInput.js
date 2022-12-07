function checkFormInput(data) {
  //- 定義error message
  let errMessage = ``;
  //- 判斷image URL格式
  const imageURL = data.image.substring(0, 4);
  const mapURL = data.google_map.substring(0, 4);
  if (imageURL !== "http" || mapURL !== "http") {
    errMessage += `
    <code>Image URL or Google_map URL is not valid !</code>
    `;
  }
  //- 判斷電話格式
  if (!data.phone.includes(" ") || data.phone.length < 9) {
    errMessage += `
      <code>Format of Tel is wrong!</code>
    `;
  } else {
    const phoneNumArr = data.phone.split(" ");
    for (let i = 0; i < phoneNumArr.length; i += 1) {
      if (isNaN(Number(phoneNumArr[i]))) {
        errMessage += `
      <code>Format of phone is wrong!</code>
      `;
        break;
      }
    }
  }
  return errMessage;
}

//- export function
module.exports = checkFormInput;
