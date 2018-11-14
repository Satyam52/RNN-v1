export default (state = {}, action) => {
    if(action.type == 0){
        return {};
    }
    else if(Number.isInteger(action.type)){
        if (action.payload) {
            return { ...state, [action.type]: action.payload };
        }
            return state;
    }
    else{
        return state;
    }
}
