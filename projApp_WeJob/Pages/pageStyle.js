import  { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        // linear-gradient(to bottom, #00cc99 0%, #3399ff 100%)
        backgroundColor:'#006699',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40
    },
    Header: {
        flex: 2
    },
    Content: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        
    },
    textBig: {
        fontSize: 50,
        color:'hsla(360, 100%, 100%, 1.0)',
        margin: 10,
        fontWeight:'bold',
        fontFamily:'sans-serif'
    },
    textMedium: {
        fontSize: 30,
        color: 'blue'
    },
    Button: {
        backgroundColor: 'lightgray',
        padding: 20,
        borderRadius: 15
    },
    TxtInp: {
        height: 50,
        width: 200,
        borderColor: 'gray',
        borderWidth: 2,
        margin: 15,
        fontSize:30,
        padding:5,
        borderRadius:5
    },
    Err:{
        color:'red',
        margin:15,
        
    },
    lblText:{
        fontSize:30
    }
});