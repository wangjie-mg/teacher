import Axios from 'axios';

function getRequest(url,func){
    Axios(url).then(res =>{
        func(res);
    }).catch(
        error =>{
            console.log(error);
    });
}
export default getRequest