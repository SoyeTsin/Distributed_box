export const api = {
    login: '/public/manage/1.0/admin/login',
    refresh: '/public/manage/1.0/admin/token/refresh',
    logout: '/manage/1.0/admin/logout',
    userList: '/manage/1.0/admin/userlist',
    userDetails: '/manage/1.0/admin/userdetails/devices/',//{user_id}
    boxList: '/manage/1.0/admin/devicelist',
    boxDetails: '/manage/1.0/admin/devicedetails/',//{device_id}
    boxLiveTime: '/manage/1.0/admin/devicedetails/livetime/',//{device_id}
    boxBandwidth: '/manage/1.0/admin/devicedetails/bandwidth/',//{device_id}
    storeList: '/manage/1.0/admin/store_credits/check',
    storeCredits: '/manage/1.0/admin/userdetails/store_credits/',//{user_id}
    userException: '/manage/1.0/admin/credits/check/user_exception',
    devicesLive: '/manage/1.0/admin/devices/count/live',//获取在线盒子数
    devicesNew: '/manage/1.0/admin/devices/count/new',//获取新增盒子数
    storage: '/manage/1.0/admin/devices/storage',
    livetimeAverage: '/manage/1.0/admin/devices/livetime/average',
    weekly: '/manage/1.0/admin/devices/livetime/average/weekly',
    appusersNew: '/manage/1.0/admin/appusers/new',//app新增用户统计
    appusersOnline: '/manage/1.0/admin/appusers/online',//app新增用户统计
    appusersVersions: '/manage/1.0/admin/appusers/versions',//app版本信息
    devicesVersions: '/manage/1.0/admin/devices/versions',//设备版本信息
}