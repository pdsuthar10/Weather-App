const initState = {
    city: 'Boston',
    unit: "F",
    toggle: false,
    speed: "miles/hour"
}

const rootReducer =(state=initState, action) =>{
    switch (action.type) {
        case 'UPDATE_CITY':
            return{
                city : action.city
            }
        case 'UPDATE_UNIT':
            if(action.toggle){
                return{
                    ...state,
                    unit: "C",
                    speed: "meter/sec",
                    toggle: true
                }
            }else{
                return{
                    ...state,
                    unit:"F",
                    speed: "miles/hour",
                    toggle:false
                }
            }
        default:
            return state;
    }
}

export default rootReducer