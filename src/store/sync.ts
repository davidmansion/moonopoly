export default function syncPlugin (connection) {
    return store => {
        const allowedActions = [
            'buyProperty',
            'rentProperty',
            'rentRailroad',
            'rentUtility',
            'mortgageProperty',
            'sellProperty',
            'drawCard',
            'jailPlayer',
            'incomeTax',
            'luxuryTax',
            'freeParking',
            'nextState',
        ]
        connection.on('data', (data, from) => {
            if(from == store.getters.getCurrentPlayer.id)
                store.dispatch(data.type, data.payload)
        })
        connection.on('state', data => {
            store.replaceState(Object.assign(store.state, { state: data.state, turns: data.turns }))
        })
        connection.on('newPlayer', data => {
            store.dispatch('newPlayer', data)
        })
        store.subscribeAction((action, state) => {
            if (allowedActions.includes(action.type) && store.getters.getSelfIsCurrentPlayer) {
                connection.sendData({ type: 'vuex', data: action })
            }
        })
    }
}