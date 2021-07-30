import React from 'react';
import { Component, useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
  Card,
  Button,
  Icon,
  Image,
  List,
  Dimmer,
  Loader,
  Segment,
} from 'semantic-ui-react';

import { message } from 'antd';
import 'antd/dist/antd.css';

import web3 from '../ethereum/web3';
import Layout from '../components/Layout';
import { Link, Router } from '../routes';
import token from '../ethereum/Token';

let imageList = [
  'https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy8wZjY1Y2Q1ZDU4NGExOGZkMDA2ZThkMTJkMDMyMjgxMy5qcGc=.jpg',
  'https://www.adweek.com/wp-content/uploads/2021/03/Brandia-Table-Top-1024x684.png',
  'https://s4.reutersmedia.net/resources/r/?m=02&d=20210301&t=2&i=1553289029&w=640&fh=&fw=&ll=&pl=&sq=&r=LYNXNPEH200WS',
  'https://blog.vsoftconsulting.com/hubfs/Modern%20Smart%20Farming.jpg',
  'https://react.semantic-ui.com/images/avatar/large/matthew.png',
  'https://react.semantic-ui.com/images/avatar/large/christian.jpg',
  'https://react.semantic-ui.com/images/avatar/large/elliot.jpg',
  'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
  'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
  'https://react.semantic-ui.com/images/avatar/large/daniel.jpg',
  'https://react.semantic-ui.com/images/avatar/large/rachel.png',
  'https://react.semantic-ui.com/images/avatar/large/helen.jpg',
  'https://react.semantic-ui.com/images/avatar/large/stevie.jpg',
  'https://react.semantic-ui.com/images/avatar/large/tom.jpg',
  'https://react.semantic-ui.com/images/avatar/large/matt.jpg',
  'https://react.semantic-ui.com/images/avatar/large/ade.jpg',
  'https://react.semantic-ui.com/images/avatar/large/joe.jpg',
  'https://react.semantic-ui.com/images/avatar/large/justen.jpg',
  'https://react.semantic-ui.com/images/avatar/large/laura.jpg',
  'https://react.semantic-ui.com/images/avatar/large/veronika.jpg',
];

const imagePetList = [
  'https://i.pinimg.com/originals/4a/59/8c/4a598ced223474c296b16cad315835d5.png',
  'https://cdn.coinranking.com/nft/0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d/140425.png?size=autox430',
  'https://lh3.googleusercontent.com/J9EZxgQVLADq0Hwn5stofuoJ192pHs7EsOqbJqltacIKWrlgFn7DkQKXacjOfQowUsSupraqyrzRxEM8ejVIk7ZBfFdphzW_zqoZ=w600',
  'https://lh3.googleusercontent.com/mYEsE51mbPkVarTJr8nFTtvmZJcntyBeD3rrZQOz1sDMrj0V6JAW2V7rvvwW7mSglmWO0rWRK5XK1w2HBti08j0=w600',
  'https://lh3.googleusercontent.com/2PMAMWKyFpGCBAw4LRJL2gOgLsgU3iwIrNZbaaGVtItoy-6vTHoaqCqrGtuw9EOPGHUsO4nL1gsMGo6Z-9iIwsdt=w600',
  'https://cdn.coinranking.com/nft/0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d/265.png?size=autox430',
  'https://lh3.googleusercontent.com/hDpEJMkrpo7XeTDFMTIlwEh0W52C029RFG2EAiwZblh7pnYmmzoAk-NoBNT9_x3_1bLZqDqfCFz2VALcIxSY3PmV=w600',
  'https://storage.googleapis.com/assets.axieinfinity.com/axies/180220/axie/axie-full-transparent.png',
  'https://storage.googleapis.com/assets.axieinfinity.com/axies/196551/axie/axie-full-transparent.png',
  'https://cdn.coinranking.com/nft/0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d/160093.png?size=autox430',
  'https://lh3.googleusercontent.com/SFt1d9wEpqHkPQ9ZHhIy_ie5X-hkRjhrlHkeFsu5fopuzI7201E5ClKmEuT8FOxrqfUEwb7lYrOXnnWyUkO7yuE=s992',
  'https://cdn.coinranking.com/nft/0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d/247661.png?size=autox430',
  'https://storage.googleapis.com/assets.axieinfinity.com/axies/44506/axie/axie-full-transparent.png',
  'https://lynnyl.io/wp-content/uploads/2021/03/Beast-Back-Hero-1024x768.png',
  'https://cdn.coinranking.com/nft/0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d/219450.png?size=autox430',
  'https://lh3.googleusercontent.com/3AQeaYEqu_-chsnfPgef4V9zViLRkRThRS0eZHBgq7p6BHfhksjiBw4XNix4a6KrWBEB0VUZynYDXRUtpovH5ewDgA=w600',
  'https://lynnyl.io/wp-content/uploads/2021/03/Aquatic-Tail-Ranchu-1024x768.png',
];

class CampaignIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingPets: Array(props.tokenCount).fill(false),
    };
  }

  //This will call by server side (nextjs)
  static async getInitialProps() {
    let t1 = performance.now();

    const accounts = await web3.eth.getAccounts();

    let tokenOwner = '';
    let tokenName = '';
    let tokenSymbol = '';
    let tokenCount = '0';
    let petTokens = [];

    try {
      tokenOwner = await token.methods.owner().call();
      tokenName = await token.methods.name().call();
      tokenSymbol = await token.methods.symbol().call();
      tokenCount = await token.methods.getTokenCount().call();
    } catch (err) {
      console.log('getInitialProps ERROR: ', err.message);
    }
    for (let i = 0; i < tokenCount; i++) {
      const pet = await token.methods.getTokenDetails(i).call();
      petTokens.push({
        damage: pet[0],
        magic: pet[1],
        lastMeal: pet[2],
        endurance: pet[3],
        petOwner: pet[4],
      });
    }

    let t2 = performance.now();

    console.log('TIME getTokenDetails() took ' + (t2 - t1) + ' ms');

    return {
      petTokens: petTokens,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      tokenOwner: tokenOwner,
      tokenCount: tokenCount,
    };
  }

  async onFeedPet(petId) {
    let loadings = this.state.loadingPets;
    loadings[petId] = true;
    this.setState({ loadingPets: loadings });

    const accounts = await web3.eth.getAccounts();
    try {
      await token.methods.feed(petId).send({
        from: accounts[0],
      });

      message.success('Successfully feed your pet!', 1);
      Router.pushRoute('/');
    } catch (err) {
      console.log('onFeedPet ERROR: ', err.message);
      message.error(err.message, 1);
    }

    loadings = this.state.loadingPets;
    loadings[petId] = false;
    this.setState({ loadingPets: loadings });
  }

  renderPets() {
    const items = this.props.petTokens.map((pet, index) => {
      let deathTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
      deathTime.setUTCSeconds(parseInt(pet.lastMeal) + parseInt(pet.endurance));

      let petAlive = true;
      const nowTime = new Date();
      if (nowTime > deathTime) {
        petAlive = false;
      }
      deathTime = deathTime.toString();

      const loadingFeed = this.state.loadingPets[index];
      return {
        key: index,
        header: <h3>ID: {index}</h3>,
        meta: (
          <Link route="\">
            <a>
              <Icon name="user circle" />
              Owned by {pet.petOwner}
            </a>
          </Link>
        ),
        description: (
          <List>
            <List.Item>
              <List.Icon name="military" />
              <List.Content>
                <List.Header>Damage: {pet.damage}</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="magic" />
              <List.Content>
                <List.Header>Magic: {pet.magic}</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon name="time" />
              <List.Content>
                <List.Header>Time to starvation: {deathTime}</List.Header>
              </List.Content>
            </List.Item>
            <Dimmer active={loadingFeed}>
              <Loader>Finding and feeding your pet foods</Loader>
            </Dimmer>
          </List>
        ),
        extra: (
          <Button
            disabled={!petAlive}
            fluid
            basic={petAlive}
            color={petAlive ? 'green' : 'red'}
            onClick={() => this.onFeedPet(index)}
            content={petAlive ? 'Feed' : 'Deadth'}
          />
        ),
        image: imagePetList[index],
        style: { overflowWrap: 'break-word' },
        color: petAlive ? 'green' : 'red',
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <Card fluid>
            <Card.Content>
              <Image floated="right" size="tiny" src={imageList[7]} circular />
              <Card.Header>{this.props.tokenName}</Card.Header>
              <Card.Meta>
                {this.props.tokenCount} {this.props.tokenSymbol}
              </Card.Meta>
              <Card.Content extra>
                <Icon name="user" />
                Creator: {this.props.tokenOwner}
              </Card.Content>
            </Card.Content>
          </Card>

          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Pet"
                icon="add circle"
                primary={true}
              />
            </a>
          </Link>
          {this.renderPets()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
