// 浅拷贝
function shallowClone(target, source){
    if(typeof ele === 'object' && ele !== null){
        throw `${target}不是对象...`;
    }

    target = new Object(target);

    Object.keys(source).forEach(key =>{
        target[key] = source[key];
    })

    return target;
}