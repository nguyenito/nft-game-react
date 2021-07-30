import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x1f421d6918F6977254Efe5f72Fba3B09bCC76c92'
);

export default instance;
