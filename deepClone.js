// 深拷贝
function deepClone(target, source){
    if(typeof ele === 'object' && ele !== null){
        throw `${target}不是对象...`;
    }

    target = new Object(target);

    Object.keys(source).forEach(key =>{
        const ele = source[key];
        
        target[key] = typeof ele === 'object' && ele !== null ? 
        ele.constructor === Array ? 
        deepClone([], ele) : 
        ele.constructor === RegExp ? new RegExp(ele) : deepClone({}, ele) : ele;
    })

    return target;
}