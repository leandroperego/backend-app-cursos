import moment from 'moment';

class Datas{

    getDataUTC(dataBrasil){
        return moment(dataBrasil, 'DD/MM/YYYY').utc().format('YYYY-MM-DD');
    }

    getDataBrasil(dataUTC){
        return moment(dataUTC).locale('pt-BR').format('L');
    }
}

export default new Datas();