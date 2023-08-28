// 讓Toast Messages在不同的Components裡面被傳遞
import emitter from "@/methods/emitter";

export default function (response, title = "更新") {
  if (response.data.success) {
    emitter.emit("push-message", {
      style: "success",
      title: `${title}成功`,
    });
  } else {
    // Format String or array[] into array[]
    const message =
      typeof response.data.message === "string"
        ? [response.data.message]
        : response.data.message;
    emitter.emit("push-message", {
      style: "danger",
      title: `${title}失敗`,
      // Example : Category 欄位為必填、 unit 欄位為必填、
      content: message.join("、"),
    });
  }
}
