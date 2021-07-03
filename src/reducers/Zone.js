


export default (state = {zone_active :0}, action) => {
    switch (action.type) {
      case 'setzone':
        return state = {zone_active : action.value.data.count}
      default:
        return state 
    }
}
