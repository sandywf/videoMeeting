import {coco as codyy_coco} from "../../utils/codyy";

/**
 * todo 向移动端发送coco消息
 * @param {string} type 消息类型
 * @param {*} contentInfo 发送的内容(有时是object有时是string, 在用的时候需要注意)
 * @param {string} uid 用户id
 */

export const handleMsgToMobile = (type, contentInfo, uid = '') =>  {
    let coco = codyy_coco.get(0)
    let groupId = coco._params.groupId; // 移动端的groupId是取groupId(也就是meetId)前6位转成16进制
    if( !coco || !type ) return;
    switch(type) {
        // 设置/取消 发言人
        case "userAction.toggleSpeaker":
            coco.callAll(
                contentInfo.type === "Y"
                    ? ["receive", "", "S", 0, "", ["receiveSpeaker", contentInfo.uid, 2,[contentInfo.mainId, "", contentInfo.uid]]]
                    : ["receive", "", "S", 0, "", ["stopReceive", 2,[contentInfo.mainId, ""], contentInfo.uid]] ,
            );
            break;
        // 开启/屏蔽 音频
        case "userAction.toggleAudio":
            coco.callOne(
                contentInfo.uid,
                ["receive", contentInfo.mainId, "S", 0, "", [contentInfo.value ? "publishAudio" : "stopAudio"]]
            )
            break;
        // 开启/屏蔽 视频
        case "userAction.toggleVideo":
            coco.callOne(
                contentInfo.uid,
                ["receive", contentInfo.mainId, "S", 0, "", [contentInfo.value ? "publishVideo" : "stopVideo"]]
            )
            break;
        // 允许/禁止 文本聊天
        case "userAction.toggleChat":
            coco.callOne(
                contentInfo.uid,
                ["receive", contentInfo.mainId, "S", 0, "", ["noChat", !contentInfo.value]],
            )
            break;
        // 允许/禁止 使用白板
        case "userAction.toggleWhitePad":
            coco.callOne(
                contentInfo.uid,
                ["receive", contentInfo.mainId, "S", 0, "", ["writeControl", contentInfo.value]],
            )
            break;
        // 禁止所有人聊天
        case "meetAction.switchAllChatting":
            coco.callAll(["receive", "", "S", 0, "", [contentInfo.forbid ? "allowSpeak" : "noSpeak"]])
            break;
        // 群聊
        case "msgAction.addMsg":
            coco.sendMsgToAll({ type: 'text', content: contentInfo.content, groupId, isMobile: true });
            break;
        // 私聊
        case "ADD_MSG":
            coco.sendMsgTo({ userId: uid, type: 'text', content: contentInfo.content });
            break;
        // 切换模式
        case "meetAction.switchMode":
            coco.callAll(["receive", "", "S", 0, "", ["turnMode", contentInfo === 'video' ? "video" : "show"]]);
            break;

        // 演示文档
        case "onShowFiles":
            coco.addPadTab({ ...contentInfo, data: {
                act: "ShowDoc",
                current: "0",
                url: contentInfo.files[0],
                tabId: contentInfo.tabId,
                id: contentInfo.from
            }});
            break;

        // 翻页
        case "onPageTurn":
            coco.write({
                owner: 'doc_' + contentInfo.documentId,
                current: (contentInfo.pageNumber - 1).toString(),
                type: 'changeDoc',
                tabId: contentInfo.tid,
                act: "changeDoc"
            });
            break;

        // 删除文档
        case "onTabRemove":
            coco.removePadTab({ ...contentInfo, data: {
                act: "DeleteDoc",
                key: contentInfo.tabId,
            }});
            break;

        // 切换文档
        case "onTabChange":
            coco.focusPadTab({ ...contentInfo, data: {
                act: "ChangeDoc",
                key: contentInfo.tabId,
            }});
            break;

        // 上传文档
        case "shareAction.addShareDoc":
            coco.callAll(["receive", "", "S", 0, "", [ "addDocItem", {}]]);
            break;

        // 共享视频
        case "meetAction.setShareVal":
            coco.callAll(["receive", "", "S", 0, "", [contentInfo.status ? "videoTransfer" : "stopReceiveShareVideo", false, ""]]);
            break;

        default: break;
    }
}