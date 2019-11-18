/* eslint-disable vars-on-top */
/* eslint-disable no-param-reassign */
/* eslint-disable one-var */
/* eslint-disable no-unused-expressions */

// 数组的深克隆
var util = (function () {
    var class2type = {},
        typeList = ['Null', 'Undefined', 'Number', 'Boolean', 'String', 'Object', 'Function', 'Array', 'RegExp', 'Date']

    typeList.forEach((item) => {
        class2type['[object ' + item + ']'] = item.toLowerCase()
    })

    function getType(obj) {
        return class2type[Object.prototype.toString.call(obj)] || 'object'
    }
    // 判断对象类型
    function isType(obj, type) {
        return getType(obj) === type
    }
    return {
        isType: isType,
        getType: getType
    }
})()


/**
 * @description: 深克隆
 * @param {obj} 需要克隆的对象
 * @return: 新的对象
 */
export const copy = (obj) => {
    //如果obj不是对象，那么直接返回值就可以了
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    //定义需要的局部变脸，根据obj的类型来调整target的类型
    var i, target = util.isType(obj, 'array') ? [] : {},
        value, valueType

    for (i in obj) {
        value = obj[i]
        valueType = util.getType(value)
        //只有在明确执行深复制，并且当前的value是数组或对象的情况下才执行递归复制
        if (valueType === 'array' || valueType === 'object') {
            target[i] = copy(value)
        } else {
            target[i] = value
        }
    }
    return target
}

/**
 * @description 展开数组结构
 * @param {arr} 多列数组
 * @returns 展开的数组
 */
export const myflat = (arr) => {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}