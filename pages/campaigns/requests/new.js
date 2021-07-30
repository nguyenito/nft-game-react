import React, { Component } from 'react';
import { Form, Button, Input, Message, Icon } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Campaign from '../../../ethereum/campaign';

class RequestNew extends Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    loading: false,
    errorMessage: '',
    displaySuccessMessage: false,
  };

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      loading: true,
      errorMessage: '',
      displaySuccessMessage: false,
    });

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({
          from: accounts[0],
        });
      this.setState({ displaySuccessMessage: true });
      // Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderInformationMessage() {
    if (this.state.loading) {
      return (
        <Message icon>
          <Icon name="circle notched" loading={this.state.loading} />
          <Message.Content>
            <Message.Header>This may take several seconds.</Message.Header>
            We're doing the transaction for you. Please wait!!!
          </Message.Content>
        </Message>
      );
    } else if (this.state.errorMessage != '') {
      return (
        <Message negative>
          <Message.Header>Opps</Message.Header>
          <p>{this.state.errorMessage}</p>
        </Message>
      );
    } else if (this.state.displaySuccessMessage) {
      return (
        <Message positive>
          <Message.Header>Request created successfully</Message.Header>
          <p>Go to back to previous page to see now.</p>
        </Message>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>
            <h4>
              <Icon name="arrow alternate circle left outline" />
              Back
            </h4>
          </a>
        </Link>
        <h3>Creat a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) => {
                this.setState({ description: event.target.value });
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => {
                this.setState({ value: event.target.value });
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={(event) => {
                this.setState({ recipient: event.target.value });
              }}
            />
          </Form.Field>
          {this.renderInformationMessage()}
          <Button disabled={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
