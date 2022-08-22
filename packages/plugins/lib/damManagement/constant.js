
//水库大坝常量配置
//水库类型
const reservoirType = ['大(一)型水库', '大(二)型水库', '中型水库', '小(一)型水库', '小(二)型水库']

//大坝类型
const damType = ['重力坝', '拱坝', '支墩坝', "堆石坝", "土坝", "土石混合坝"]

export {
    reservoirType, damType
}

// 桥梁相关
export const BridgeApiTable = {

    findAllPartComponents: 'struct/{structId}/bridge/part/componets',
    getMembers: 'struct/{structId}/bridge/part/member',
    postMember: 'struct/bridge/part/member',
    putMember: 'struct/bridge/part/member/{memberId}',
    delMember: 'struct/bridge/part/member/{memberId}',
    getStructHasMembers: 'struct/{structId}/has/members',
    getStructMembers: 'struct/{structId}/members',

};