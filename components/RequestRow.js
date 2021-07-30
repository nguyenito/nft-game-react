import React, { Component } from 'react';
import { Table, Icon, Button, Message, Popup, Rating } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '..//ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
  state = {
    approveLoading: false,
    finalizeLoading: false,
    approveError: '',
    finalizeError: '',
  };

  onApprove = async () => {
    this.setState({ approveLoading: true, approveError: '' });

    try {
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
      Router.pushRoute('/campaigns/' + this.props.address + '/requests');
    } catch (err) {
      this.setState({ approveError: err.message });
    }

    this.setState({ approveLoading: false });
  };

  onFinalize = async () => {
    this.setState({
      finalizeLoading: true,
      finalizeError: '',
    });

    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    try {
      await campaign.methods.finalizedRequest(this.props.id).send({
        from: accounts[0],
      });

      Router.pushRoute('/campaigns/' + this.props.address + '/requests');
    } catch (err) {
      this.setState({ finalizeError: err.message });
    }

    this.setState({ finalizeLoading: false });
  };

  renderErrorMessage(errorMessage) {
    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell>
            <Message header="Opps" error content={errorMessage} />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  renderApproveButton() {
    return (
      <Button
        loading={this.state.approveLoading}
        color="green"
        basic
        onClick={this.onApprove}
      >
        <Icon name="handshake outline" />
        Approve
      </Button>
    );
  }

  renderFinalizeButton() {
    return (
      <Button
        loading={this.state.finalizeLoading}
        color="teal"
        basic
        onClick={this.onFinalize}
      >
        <Icon name="send" />
        Finalize
      </Button>
    );
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize =
      request.approvalCount > approversCount / 2 && !request.complete;
    return (
      <Row disabled={request.complete} positive={readyToFinalize}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Popup trigger={this.renderApproveButton()}>
              <Popup.Header>Only contributors can approve!</Popup.Header>
            </Popup>
          )}
          {this.state.approveError != ''
            ? this.renderErrorMessage(this.state.approveError)
            : null}
        </Cell>
        <Cell>
          {request.complete ? (
            <Button disabled basic color="teal">
              <Icon name="checkmark" />
              Finalized
            </Button>
          ) : (
            <Popup trigger={this.renderFinalizeButton()}>
              <Popup.Header>Only manger can finalize!</Popup.Header>
            </Popup>
          )}
          {readyToFinalize ? <Icon name="attention" /> : null}
          {this.state.finalizeError != ''
            ? this.renderErrorMessage(this.state.finalizeError)
            : null}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
