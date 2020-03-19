const initState = {
    city: 'Boston'
}

const rootReducer =(state=initState, action) =>{
    switch (action.type) {
        case 'UPDATE_CITY':
            return{
                city : action.city
            }
        default:
            return state;
    }
}

export default rootReducer