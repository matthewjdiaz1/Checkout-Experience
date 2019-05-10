// For the basic requirements, you MUST place all of your React components into one file, app.jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: 0,
      info: {
        name: '',
        email: '',
        password: '',
        shippingAddress: '',
        cityState: '',
        zip: '',
        cc: '',
        expDate: '',
        cvv: '',
        billingZip: ''
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(info) {
    var newState = Object.create(this.state.info);
    for (const key in info) {
      newState[key] = info[key];
    }
    this.setState({ info: newState });

    if (this.state.currentForm === 5) {
      this.setState({ currentForm: 0 });
    } else {
      this.setState({ currentForm: this.state.currentForm + 1 });
    }
  }

  render() {
    if (this.state.currentForm === 0) {
      return React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement('input', { type: 'submit', value: 'Checkout' })
      );
    } else if (this.state.currentForm === 1) {
      return React.createElement(
        'div',
        null,
        React.createElement(F1, { handleSubmit: this.handleSubmit })
      );
    } else if (this.state.currentForm === 2) {
      return React.createElement(
        'div',
        null,
        React.createElement(F2, { handleSubmit: this.handleSubmit })
      );
    } else if (this.state.currentForm === 3) {
      return React.createElement(
        'div',
        null,
        React.createElement(F3, { handleSubmit: this.handleSubmit })
      );
    } else if (this.state.currentForm === 4) {
      return React.createElement(
        'div',
        null,
        React.createElement(Purchase, { info: this.state.info, handleSubmit: this.handleSubmit })
      );
    }
  }
}

class F1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    };
    this.f1Submit = this.f1Submit.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
  }
  f1Submit(e) {
    e.preventDefault();
    // TODO - update all state values (or store?)
    console.log('F1 state', this.state);
    // console.log(this.props.handleSubmit);
    this.props.handleSubmit(this.state);
  }
  nameChange(e) {
    e.preventDefault();
    this.setState({ name: e.target.value });
  }
  emailChange(e) {
    e.preventDefault();
    this.setState({ email: e.target.value });
  }
  passwordChange(e) {
    e.preventDefault();
    this.setState({ password: e.target.value });
  }

  // F1 collects name, email, and password for account creation.
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'form',
        null,
        React.createElement(
          'label',
          null,
          'Name: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.name, onChange: this.nameChange })
        )
      ),
      React.createElement(
        'form',
        null,
        React.createElement(
          'label',
          null,
          'Email: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.email, onChange: this.emailChange })
        )
      ),
      React.createElement(
        'form',
        { onSubmit: this.f1Submit },
        React.createElement(
          'label',
          null,
          'Password: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.password, onChange: this.passwordChange })
        ),
        React.createElement('input', { type: 'submit', value: 'Next' })
      )
    );
  }
}

class F2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingAddress: '',
      cityState: '',
      zip: ''
    };
    this.f2Submit = this.f2Submit.bind(this);
    this.shippingAddressChange = this.shippingAddressChange.bind(this);
    this.cityStateChange = this.cityStateChange.bind(this);
    this.zipChange = this.zipChange.bind(this);
  }
  f2Submit(e) {
    e.preventDefault();
    console.log('F2 state', this.state);
    // console.log(this.props.handleSubmit);
    this.props.handleSubmit(this.state);
  }
  shippingAddressChange(e) {
    e.preventDefault();
    this.setState({ shippingAddress: e.target.value });
  }
  cityStateChange(e) {
    e.preventDefault();
    this.setState({ cityState: e.target.value });
  }
  zipChange(e) {
    e.preventDefault();
    this.setState({ zip: e.target.value });
  }

  // F2 collects ship to address (line 1, line 2, city, state, zip code) and phone number.
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'form',
        null,
        React.createElement(
          'label',
          null,
          'Shipping Address: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.shippingAddress, onChange: this.shippingAddressChange })
        )
      ),
      React.createElement(
        'form',
        null,
        React.createElement(
          'label',
          null,
          'City/State: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.cityState, onChange: this.cityStateChange })
        )
      ),
      React.createElement(
        'form',
        { onSubmit: this.f2Submit },
        React.createElement(
          'label',
          null,
          'Zip: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.zip, onChange: this.zipChange })
        ),
        React.createElement('input', { type: 'submit', value: 'Next' })
      )
    );
  }
}

class F3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cc: '',
      expDate: '',
      cvv: '',
      billingZip: ''
    };
    this.f3Submit = this.f3Submit.bind(this);
    this.ccChange = this.ccChange.bind(this);
    this.expDateChange = this.expDateChange.bind(this);
    this.cvvChange = this.cvvChange.bind(this);
    this.billingZipChange = this.billingZipChange.bind(this);
  }
  f3Submit(e) {
    e.preventDefault();
    console.log('F3 state', this.state);
    this.props.handleSubmit(this.state);
  }
  ccChange(e) {
    e.preventDefault();
    this.setState({ cc: e.target.value });
  }
  expDateChange(e) {
    e.preventDefault();
    this.setState({ expDate: e.target.value });
  }
  cvvChange(e) {
    e.preventDefault();
    this.setState({ cvv: e.target.value });
  }
  billingZipChange(e) {
    e.preventDefault();
    this.setState({ billingZip: e.target.value });
  }

  // F3 collects credit card #, expiry date, CVV, and billing zip code.
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'form',
        null,
        React.createElement(
          'label',
          null,
          'Credit Card #: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.cc, onChange: this.ccChange })
        )
      ),
      React.createElement(
        'form',
        null,
        React.createElement(
          'label',
          null,
          'Exp Date: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.expDate, onChange: this.expDateChange })
        )
      ),
      React.createElement(
        'form',
        null,
        React.createElement(
          'label',
          null,
          'CVV: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.cvv, onChange: this.cvvChange })
        )
      ),
      React.createElement(
        'form',
        { onSubmit: this.f3Submit },
        React.createElement(
          'label',
          null,
          'Billing Zip: ',
          React.createElement('input', { type: 'text', name: 'name', value: this.state.billingzip, onChange: this.billingZipChange })
        ),
        React.createElement('input', { type: 'submit', value: 'Next' })
      )
    );
  }
}

class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return React.createElement(
      'div',
      null,
      'Name: ',
      this.props.info.name,
      React.createElement('p', null),
      'Email: ',
      this.props.info.email,
      React.createElement('p', null),
      'Password: ****',
      React.createElement('p', null),
      'Shipping Address: ',
      this.props.info.shippingAddress,
      React.createElement('p', null),
      'City/State: ',
      this.props.info.cityState,
      React.createElement('p', null),
      'Zip: ',
      this.props.info.zip,
      React.createElement('p', null),
      'Credit Card: ',
      this.props.info.cc,
      React.createElement('p', null),
      'Exp Date: ',
      this.props.info.expDate,
      React.createElement('p', null),
      'CVV: ',
      this.props.info.cvv,
      React.createElement('p', null),
      'Billing Zip: ',
      this.props.info.billingZip,
      React.createElement('p', null),
      React.createElement(
        'form',
        null,
        React.createElement('input', { type: 'submit', value: 'Purchase' })
      )
    );
  }
}

export default App;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2FwcC5qc3giXSwibmFtZXMiOlsiQXBwIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwic3RhdGUiLCJjdXJyZW50Rm9ybSIsImluZm8iLCJuYW1lIiwiZW1haWwiLCJwYXNzd29yZCIsInNoaXBwaW5nQWRkcmVzcyIsImNpdHlTdGF0ZSIsInppcCIsImNjIiwiZXhwRGF0ZSIsImN2diIsImJpbGxpbmdaaXAiLCJoYW5kbGVTdWJtaXQiLCJiaW5kIiwibmV3U3RhdGUiLCJPYmplY3QiLCJjcmVhdGUiLCJrZXkiLCJzZXRTdGF0ZSIsInJlbmRlciIsIkYxIiwiZjFTdWJtaXQiLCJuYW1lQ2hhbmdlIiwiZW1haWxDaGFuZ2UiLCJwYXNzd29yZENoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImNvbnNvbGUiLCJsb2ciLCJ0YXJnZXQiLCJ2YWx1ZSIsIkYyIiwiZjJTdWJtaXQiLCJzaGlwcGluZ0FkZHJlc3NDaGFuZ2UiLCJjaXR5U3RhdGVDaGFuZ2UiLCJ6aXBDaGFuZ2UiLCJGMyIsImYzU3VibWl0IiwiY2NDaGFuZ2UiLCJleHBEYXRlQ2hhbmdlIiwiY3Z2Q2hhbmdlIiwiYmlsbGluZ1ppcENoYW5nZSIsImJpbGxpbmd6aXAiLCJQdXJjaGFzZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxNQUFNQSxHQUFOLFNBQWtCQyxNQUFNQyxTQUF4QixDQUFrQztBQUNoQ0MsY0FBWUMsS0FBWixFQUFtQjtBQUNqQixVQUFNQSxLQUFOO0FBQ0EsU0FBS0MsS0FBTCxHQUFhO0FBQ1hDLG1CQUFhLENBREY7QUFFWEMsWUFBTTtBQUNKQyxjQUFNLEVBREY7QUFFSkMsZUFBTyxFQUZIO0FBR0pDLGtCQUFVLEVBSE47QUFJSkMseUJBQWlCLEVBSmI7QUFLSkMsbUJBQVcsRUFMUDtBQU1KQyxhQUFLLEVBTkQ7QUFPSkMsWUFBSSxFQVBBO0FBUUpDLGlCQUFTLEVBUkw7QUFTSkMsYUFBSyxFQVREO0FBVUpDLG9CQUFZO0FBVlI7QUFGSyxLQUFiO0FBZUEsU0FBS0MsWUFBTCxHQUFvQixLQUFLQSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNEO0FBQ0RELGVBQWFYLElBQWIsRUFBbUI7QUFDakIsUUFBSWEsV0FBV0MsT0FBT0MsTUFBUCxDQUFjLEtBQUtqQixLQUFMLENBQVdFLElBQXpCLENBQWY7QUFDQSxTQUFLLE1BQU1nQixHQUFYLElBQWtCaEIsSUFBbEIsRUFBd0I7QUFDdEJhLGVBQVNHLEdBQVQsSUFBZ0JoQixLQUFLZ0IsR0FBTCxDQUFoQjtBQUNEO0FBQ0QsU0FBS0MsUUFBTCxDQUFjLEVBQUVqQixNQUFNYSxRQUFSLEVBQWQ7O0FBRUEsUUFBSSxLQUFLZixLQUFMLENBQVdDLFdBQVgsS0FBMkIsQ0FBL0IsRUFBa0M7QUFDaEMsV0FBS2tCLFFBQUwsQ0FBYyxFQUFFbEIsYUFBYSxDQUFmLEVBQWQ7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLa0IsUUFBTCxDQUFjLEVBQUVsQixhQUFhLEtBQUtELEtBQUwsQ0FBV0MsV0FBWCxHQUF5QixDQUF4QyxFQUFkO0FBQ0Q7QUFDRjs7QUFFRG1CLFdBQVM7QUFDUCxRQUFJLEtBQUtwQixLQUFMLENBQVdDLFdBQVgsS0FBMkIsQ0FBL0IsRUFBa0M7QUFDaEMsYUFDRTtBQUFBO0FBQUEsVUFBTSxVQUFVLEtBQUtZLFlBQXJCO0FBQ0UsdUNBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sVUFBM0I7QUFERixPQURGO0FBS0QsS0FORCxNQU1PLElBQUksS0FBS2IsS0FBTCxDQUFXQyxXQUFYLEtBQTJCLENBQS9CLEVBQWtDO0FBQ3ZDLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsNEJBQUMsRUFBRCxJQUFJLGNBQWMsS0FBS1ksWUFBdkI7QUFERixPQURGO0FBS0QsS0FOTSxNQU1BLElBQUksS0FBS2IsS0FBTCxDQUFXQyxXQUFYLEtBQTJCLENBQS9CLEVBQWtDO0FBQ3ZDLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsNEJBQUMsRUFBRCxJQUFJLGNBQWMsS0FBS1ksWUFBdkI7QUFERixPQURGO0FBS0QsS0FOTSxNQU1BLElBQUksS0FBS2IsS0FBTCxDQUFXQyxXQUFYLEtBQTJCLENBQS9CLEVBQWtDO0FBQ3ZDLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsNEJBQUMsRUFBRCxJQUFJLGNBQWMsS0FBS1ksWUFBdkI7QUFERixPQURGO0FBS0QsS0FOTSxNQU1BLElBQUksS0FBS2IsS0FBTCxDQUFXQyxXQUFYLEtBQTJCLENBQS9CLEVBQWtDO0FBQ3ZDLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsNEJBQUMsUUFBRCxJQUFVLE1BQU0sS0FBS0QsS0FBTCxDQUFXRSxJQUEzQixFQUFpQyxjQUFjLEtBQUtXLFlBQXBEO0FBREYsT0FERjtBQUtEO0FBQ0Y7QUFsRStCOztBQXFFbEMsTUFBTVEsRUFBTixTQUFpQnpCLE1BQU1DLFNBQXZCLENBQWlDO0FBQy9CQyxjQUFZQyxLQUFaLEVBQW1CO0FBQ2pCLFVBQU1BLEtBQU47QUFDQSxTQUFLQyxLQUFMLEdBQWE7QUFDWEcsWUFBTSxFQURLO0FBRVhDLGFBQU8sRUFGSTtBQUdYQyxnQkFBVTtBQUhDLEtBQWI7QUFLQSxTQUFLaUIsUUFBTCxHQUFnQixLQUFLQSxRQUFMLENBQWNSLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxTQUFLUyxVQUFMLEdBQWtCLEtBQUtBLFVBQUwsQ0FBZ0JULElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBS1UsV0FBTCxHQUFtQixLQUFLQSxXQUFMLENBQWlCVixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUtXLGNBQUwsR0FBc0IsS0FBS0EsY0FBTCxDQUFvQlgsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBdEI7QUFDRDtBQUNEUSxXQUFTSSxDQUFULEVBQVk7QUFDVkEsTUFBRUMsY0FBRjtBQUNBO0FBQ0FDLFlBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCLEtBQUs3QixLQUE3QjtBQUNBO0FBQ0EsU0FBS0QsS0FBTCxDQUFXYyxZQUFYLENBQXdCLEtBQUtiLEtBQTdCO0FBQ0Q7QUFDRHVCLGFBQVdHLENBQVgsRUFBYztBQUNaQSxNQUFFQyxjQUFGO0FBQ0EsU0FBS1IsUUFBTCxDQUFjLEVBQUVoQixNQUFNdUIsRUFBRUksTUFBRixDQUFTQyxLQUFqQixFQUFkO0FBQ0Q7QUFDRFAsY0FBWUUsQ0FBWixFQUFlO0FBQ2JBLE1BQUVDLGNBQUY7QUFDQSxTQUFLUixRQUFMLENBQWMsRUFBRWYsT0FBT3NCLEVBQUVJLE1BQUYsQ0FBU0MsS0FBbEIsRUFBZDtBQUNEO0FBQ0ROLGlCQUFlQyxDQUFmLEVBQWtCO0FBQ2hCQSxNQUFFQyxjQUFGO0FBQ0EsU0FBS1IsUUFBTCxDQUFjLEVBQUVkLFVBQVVxQixFQUFFSSxNQUFGLENBQVNDLEtBQXJCLEVBQWQ7QUFDRDs7QUFFRDtBQUNBWCxXQUFTO0FBQ1AsV0FDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFhLHlDQUFPLE1BQUssTUFBWixFQUFtQixNQUFLLE1BQXhCLEVBQStCLE9BQU8sS0FBS3BCLEtBQUwsQ0FBV0csSUFBakQsRUFBdUQsVUFBVSxLQUFLb0IsVUFBdEU7QUFBYjtBQURGLE9BREY7QUFJRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFjLHlDQUFPLE1BQUssTUFBWixFQUFtQixNQUFLLE1BQXhCLEVBQStCLE9BQU8sS0FBS3ZCLEtBQUwsQ0FBV0ksS0FBakQsRUFBd0QsVUFBVSxLQUFLb0IsV0FBdkU7QUFBZDtBQURGLE9BSkY7QUFPRTtBQUFBO0FBQUEsVUFBTSxVQUFVLEtBQUtGLFFBQXJCO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBaUIseUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssTUFBeEIsRUFBK0IsT0FBTyxLQUFLdEIsS0FBTCxDQUFXSyxRQUFqRCxFQUEyRCxVQUFVLEtBQUtvQixjQUExRTtBQUFqQixTQURGO0FBRUUsdUNBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sTUFBM0I7QUFGRjtBQVBGLEtBREY7QUFjRDtBQWpEOEI7O0FBb0RqQyxNQUFNTyxFQUFOLFNBQWlCcEMsTUFBTUMsU0FBdkIsQ0FBaUM7QUFDL0JDLGNBQVlDLEtBQVosRUFBbUI7QUFDakIsVUFBTUEsS0FBTjtBQUNBLFNBQUtDLEtBQUwsR0FBYTtBQUNYTSx1QkFBaUIsRUFETjtBQUVYQyxpQkFBVyxFQUZBO0FBR1hDLFdBQUs7QUFITSxLQUFiO0FBS0EsU0FBS3lCLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxDQUFjbkIsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNBLFNBQUtvQixxQkFBTCxHQUE2QixLQUFLQSxxQkFBTCxDQUEyQnBCLElBQTNCLENBQWdDLElBQWhDLENBQTdCO0FBQ0EsU0FBS3FCLGVBQUwsR0FBdUIsS0FBS0EsZUFBTCxDQUFxQnJCLElBQXJCLENBQTBCLElBQTFCLENBQXZCO0FBQ0EsU0FBS3NCLFNBQUwsR0FBaUIsS0FBS0EsU0FBTCxDQUFldEIsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNEO0FBQ0RtQixXQUFTUCxDQUFULEVBQVk7QUFDVkEsTUFBRUMsY0FBRjtBQUNBQyxZQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QixLQUFLN0IsS0FBN0I7QUFDQTtBQUNBLFNBQUtELEtBQUwsQ0FBV2MsWUFBWCxDQUF3QixLQUFLYixLQUE3QjtBQUNEO0FBQ0RrQyx3QkFBc0JSLENBQXRCLEVBQXlCO0FBQ3ZCQSxNQUFFQyxjQUFGO0FBQ0EsU0FBS1IsUUFBTCxDQUFjLEVBQUViLGlCQUFpQm9CLEVBQUVJLE1BQUYsQ0FBU0MsS0FBNUIsRUFBZDtBQUNEO0FBQ0RJLGtCQUFnQlQsQ0FBaEIsRUFBbUI7QUFDakJBLE1BQUVDLGNBQUY7QUFDQSxTQUFLUixRQUFMLENBQWMsRUFBRVosV0FBV21CLEVBQUVJLE1BQUYsQ0FBU0MsS0FBdEIsRUFBZDtBQUNEO0FBQ0RLLFlBQVVWLENBQVYsRUFBYTtBQUNYQSxNQUFFQyxjQUFGO0FBQ0EsU0FBS1IsUUFBTCxDQUFjLEVBQUVYLEtBQUtrQixFQUFFSSxNQUFGLENBQVNDLEtBQWhCLEVBQWQ7QUFDRDs7QUFFRDtBQUNBWCxXQUFTO0FBQ1AsV0FDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUF5Qix5Q0FBTyxNQUFLLE1BQVosRUFBbUIsTUFBSyxNQUF4QixFQUErQixPQUFPLEtBQUtwQixLQUFMLENBQVdNLGVBQWpELEVBQWtFLFVBQVUsS0FBSzRCLHFCQUFqRjtBQUF6QjtBQURGLE9BREY7QUFJRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFtQix5Q0FBTyxNQUFLLE1BQVosRUFBbUIsTUFBSyxNQUF4QixFQUErQixPQUFPLEtBQUtsQyxLQUFMLENBQVdPLFNBQWpELEVBQTRELFVBQVUsS0FBSzRCLGVBQTNFO0FBQW5CO0FBREYsT0FKRjtBQU9FO0FBQUE7QUFBQSxVQUFNLFVBQVUsS0FBS0YsUUFBckI7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFZLHlDQUFPLE1BQUssTUFBWixFQUFtQixNQUFLLE1BQXhCLEVBQStCLE9BQU8sS0FBS2pDLEtBQUwsQ0FBV1EsR0FBakQsRUFBc0QsVUFBVSxLQUFLNEIsU0FBckU7QUFBWixTQURGO0FBRUUsdUNBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sTUFBM0I7QUFGRjtBQVBGLEtBREY7QUFjRDtBQWhEOEI7O0FBbURqQyxNQUFNQyxFQUFOLFNBQWlCekMsTUFBTUMsU0FBdkIsQ0FBaUM7QUFDL0JDLGNBQVlDLEtBQVosRUFBbUI7QUFDakIsVUFBTUEsS0FBTjtBQUNBLFNBQUtDLEtBQUwsR0FBYTtBQUNYUyxVQUFJLEVBRE87QUFFWEMsZUFBUyxFQUZFO0FBR1hDLFdBQUssRUFITTtBQUlYQyxrQkFBWTtBQUpELEtBQWI7QUFNQSxTQUFLMEIsUUFBTCxHQUFnQixLQUFLQSxRQUFMLENBQWN4QixJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0EsU0FBS3lCLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxDQUFjekIsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNBLFNBQUswQixhQUFMLEdBQXFCLEtBQUtBLGFBQUwsQ0FBbUIxQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUsyQixTQUFMLEdBQWlCLEtBQUtBLFNBQUwsQ0FBZTNCLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDQSxTQUFLNEIsZ0JBQUwsR0FBd0IsS0FBS0EsZ0JBQUwsQ0FBc0I1QixJQUF0QixDQUEyQixJQUEzQixDQUF4QjtBQUNEO0FBQ0R3QixXQUFTWixDQUFULEVBQVk7QUFDVkEsTUFBRUMsY0FBRjtBQUNBQyxZQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QixLQUFLN0IsS0FBN0I7QUFDQSxTQUFLRCxLQUFMLENBQVdjLFlBQVgsQ0FBd0IsS0FBS2IsS0FBN0I7QUFDRDtBQUNEdUMsV0FBU2IsQ0FBVCxFQUFZO0FBQ1ZBLE1BQUVDLGNBQUY7QUFDQSxTQUFLUixRQUFMLENBQWMsRUFBRVYsSUFBSWlCLEVBQUVJLE1BQUYsQ0FBU0MsS0FBZixFQUFkO0FBQ0Q7QUFDRFMsZ0JBQWNkLENBQWQsRUFBaUI7QUFDZkEsTUFBRUMsY0FBRjtBQUNBLFNBQUtSLFFBQUwsQ0FBYyxFQUFFVCxTQUFTZ0IsRUFBRUksTUFBRixDQUFTQyxLQUFwQixFQUFkO0FBQ0Q7QUFDRFUsWUFBVWYsQ0FBVixFQUFhO0FBQ1hBLE1BQUVDLGNBQUY7QUFDQSxTQUFLUixRQUFMLENBQWMsRUFBRVIsS0FBS2UsRUFBRUksTUFBRixDQUFTQyxLQUFoQixFQUFkO0FBQ0Q7QUFDRFcsbUJBQWlCaEIsQ0FBakIsRUFBb0I7QUFDbEJBLE1BQUVDLGNBQUY7QUFDQSxTQUFLUixRQUFMLENBQWMsRUFBRVAsWUFBWWMsRUFBRUksTUFBRixDQUFTQyxLQUF2QixFQUFkO0FBQ0Q7O0FBRUQ7QUFDQVgsV0FBUztBQUNQLFdBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBc0IseUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssTUFBeEIsRUFBK0IsT0FBTyxLQUFLcEIsS0FBTCxDQUFXUyxFQUFqRCxFQUFxRCxVQUFVLEtBQUs4QixRQUFwRTtBQUF0QjtBQURGLE9BREY7QUFJRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFpQix5Q0FBTyxNQUFLLE1BQVosRUFBbUIsTUFBSyxNQUF4QixFQUErQixPQUFPLEtBQUt2QyxLQUFMLENBQVdVLE9BQWpELEVBQTBELFVBQVUsS0FBSzhCLGFBQXpFO0FBQWpCO0FBREYsT0FKRjtBQU9FO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQVkseUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssTUFBeEIsRUFBK0IsT0FBTyxLQUFLeEMsS0FBTCxDQUFXVyxHQUFqRCxFQUFzRCxVQUFVLEtBQUs4QixTQUFyRTtBQUFaO0FBREYsT0FQRjtBQVVFO0FBQUE7QUFBQSxVQUFNLFVBQVUsS0FBS0gsUUFBckI7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFvQix5Q0FBTyxNQUFLLE1BQVosRUFBbUIsTUFBSyxNQUF4QixFQUErQixPQUFPLEtBQUt0QyxLQUFMLENBQVcyQyxVQUFqRCxFQUE2RCxVQUFVLEtBQUtELGdCQUE1RTtBQUFwQixTQURGO0FBRUUsdUNBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sTUFBM0I7QUFGRjtBQVZGLEtBREY7QUFpQkQ7QUF4RDhCOztBQTJEakMsTUFBTUUsUUFBTixTQUF1QmhELE1BQU1DLFNBQTdCLENBQXVDO0FBQ3JDQyxjQUFZQyxLQUFaLEVBQW1CO0FBQ2pCLFVBQU1BLEtBQU47QUFDQSxTQUFLQyxLQUFMLEdBQWEsRUFBYjtBQUdEO0FBQ0RvQixXQUFTO0FBQ1AsV0FDRTtBQUFBO0FBQUE7QUFBQTtBQUNTLFdBQUtyQixLQUFMLENBQVdHLElBQVgsQ0FBZ0JDLElBRHpCO0FBQzhCLG9DQUQ5QjtBQUFBO0FBRVUsV0FBS0osS0FBTCxDQUFXRyxJQUFYLENBQWdCRSxLQUYxQjtBQUVnQyxvQ0FGaEM7QUFBQTtBQUdnQixvQ0FIaEI7QUFBQTtBQUlxQixXQUFLTCxLQUFMLENBQVdHLElBQVgsQ0FBZ0JJLGVBSnJDO0FBSXFELG9DQUpyRDtBQUFBO0FBS2UsV0FBS1AsS0FBTCxDQUFXRyxJQUFYLENBQWdCSyxTQUwvQjtBQUt5QyxvQ0FMekM7QUFBQTtBQU1RLFdBQUtSLEtBQUwsQ0FBV0csSUFBWCxDQUFnQk0sR0FOeEI7QUFNNEIsb0NBTjVCO0FBQUE7QUFPZ0IsV0FBS1QsS0FBTCxDQUFXRyxJQUFYLENBQWdCTyxFQVBoQztBQU9tQyxvQ0FQbkM7QUFBQTtBQVFhLFdBQUtWLEtBQUwsQ0FBV0csSUFBWCxDQUFnQlEsT0FSN0I7QUFRcUMsb0NBUnJDO0FBQUE7QUFTUSxXQUFLWCxLQUFMLENBQVdHLElBQVgsQ0FBZ0JTLEdBVHhCO0FBUzRCLG9DQVQ1QjtBQUFBO0FBVWdCLFdBQUtaLEtBQUwsQ0FBV0csSUFBWCxDQUFnQlUsVUFWaEM7QUFVMkMsb0NBVjNDO0FBV0U7QUFBQTtBQUFBO0FBQ0UsdUNBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sVUFBM0I7QUFERjtBQVhGLEtBREY7QUFpQkQ7QUF6Qm9DOztBQTRCdkMsZUFBZWpCLEdBQWYiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRm9yIHRoZSBiYXNpYyByZXF1aXJlbWVudHMsIHlvdSBNVVNUIHBsYWNlIGFsbCBvZiB5b3VyIFJlYWN0IGNvbXBvbmVudHMgaW50byBvbmUgZmlsZSwgYXBwLmpzeFxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGN1cnJlbnRGb3JtOiAwLFxuICAgICAgaW5mbzoge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHNoaXBwaW5nQWRkcmVzczogJycsXG4gICAgICAgIGNpdHlTdGF0ZTogJycsXG4gICAgICAgIHppcDogJycsXG4gICAgICAgIGNjOiAnJyxcbiAgICAgICAgZXhwRGF0ZTogJycsXG4gICAgICAgIGN2djogJycsXG4gICAgICAgIGJpbGxpbmdaaXA6ICcnLFxuICAgICAgfSxcbiAgICB9XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIGhhbmRsZVN1Ym1pdChpbmZvKSB7XG4gICAgdmFyIG5ld1N0YXRlID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN0YXRlLmluZm8pO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGluZm8pIHtcbiAgICAgIG5ld1N0YXRlW2tleV0gPSBpbmZvW2tleV07XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpbmZvOiBuZXdTdGF0ZSB9KTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGb3JtID09PSA1KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZvcm06IDAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50Rm9ybTogdGhpcy5zdGF0ZS5jdXJyZW50Rm9ybSArIDEgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGb3JtID09PSAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJDaGVja291dFwiIC8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZvcm0gPT09IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPEYxIGhhbmRsZVN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5jdXJyZW50Rm9ybSA9PT0gMikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8RjIgaGFuZGxlU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGb3JtID09PSAzKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxGMyBoYW5kbGVTdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZvcm0gPT09IDQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFB1cmNoYXNlIGluZm89e3RoaXMuc3RhdGUuaW5mb30gaGFuZGxlU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEYxIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgZW1haWw6ICcnLFxuICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgIH1cbiAgICB0aGlzLmYxU3VibWl0ID0gdGhpcy5mMVN1Ym1pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMubmFtZUNoYW5nZSA9IHRoaXMubmFtZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZW1haWxDaGFuZ2UgPSB0aGlzLmVtYWlsQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wYXNzd29yZENoYW5nZSA9IHRoaXMucGFzc3dvcmRDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuICBmMVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vIFRPRE8gLSB1cGRhdGUgYWxsIHN0YXRlIHZhbHVlcyAob3Igc3RvcmU/KVxuICAgIGNvbnNvbGUubG9nKCdGMSBzdGF0ZScsIHRoaXMuc3RhdGUpO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucHJvcHMuaGFuZGxlU3VibWl0KTtcbiAgICB0aGlzLnByb3BzLmhhbmRsZVN1Ym1pdCh0aGlzLnN0YXRlKTtcbiAgfVxuICBuYW1lQ2hhbmdlKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG4gIGVtYWlsQ2hhbmdlKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGVtYWlsOiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgfVxuICBwYXNzd29yZENoYW5nZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwYXNzd29yZDogZS50YXJnZXQudmFsdWUgfSk7XG4gIH1cblxuICAvLyBGMSBjb2xsZWN0cyBuYW1lLCBlbWFpbCwgYW5kIHBhc3N3b3JkIGZvciBhY2NvdW50IGNyZWF0aW9uLlxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICAgIDxsYWJlbD5OYW1lOiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9IG9uQ2hhbmdlPXt0aGlzLm5hbWVDaGFuZ2V9IC8+PC9sYWJlbD5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgICA8bGFiZWw+RW1haWw6IDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e3RoaXMuc3RhdGUuZW1haWx9IG9uQ2hhbmdlPXt0aGlzLmVtYWlsQ2hhbmdlfSAvPjwvbGFiZWw+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuZjFTdWJtaXR9PlxuICAgICAgICAgIDxsYWJlbD5QYXNzd29yZDogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT17dGhpcy5zdGF0ZS5wYXNzd29yZH0gb25DaGFuZ2U9e3RoaXMucGFzc3dvcmRDaGFuZ2V9IC8+PC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiTmV4dFwiIC8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgRjIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2hpcHBpbmdBZGRyZXNzOiAnJyxcbiAgICAgIGNpdHlTdGF0ZTogJycsXG4gICAgICB6aXA6ICcnLFxuICAgIH1cbiAgICB0aGlzLmYyU3VibWl0ID0gdGhpcy5mMlN1Ym1pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hpcHBpbmdBZGRyZXNzQ2hhbmdlID0gdGhpcy5zaGlwcGluZ0FkZHJlc3NDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNpdHlTdGF0ZUNoYW5nZSA9IHRoaXMuY2l0eVN0YXRlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy56aXBDaGFuZ2UgPSB0aGlzLnppcENoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG4gIGYyU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ0YyIHN0YXRlJywgdGhpcy5zdGF0ZSk7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5wcm9wcy5oYW5kbGVTdWJtaXQpO1xuICAgIHRoaXMucHJvcHMuaGFuZGxlU3VibWl0KHRoaXMuc3RhdGUpO1xuICB9XG4gIHNoaXBwaW5nQWRkcmVzc0NoYW5nZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaGlwcGluZ0FkZHJlc3M6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG4gIGNpdHlTdGF0ZUNoYW5nZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjaXR5U3RhdGU6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG4gIHppcENoYW5nZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyB6aXA6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG5cbiAgLy8gRjIgY29sbGVjdHMgc2hpcCB0byBhZGRyZXNzIChsaW5lIDEsIGxpbmUgMiwgY2l0eSwgc3RhdGUsIHppcCBjb2RlKSBhbmQgcGhvbmUgbnVtYmVyLlxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICAgIDxsYWJlbD5TaGlwcGluZyBBZGRyZXNzOiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXt0aGlzLnN0YXRlLnNoaXBwaW5nQWRkcmVzc30gb25DaGFuZ2U9e3RoaXMuc2hpcHBpbmdBZGRyZXNzQ2hhbmdlfSAvPjwvbGFiZWw+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPGZvcm0+XG4gICAgICAgICAgPGxhYmVsPkNpdHkvU3RhdGU6IDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e3RoaXMuc3RhdGUuY2l0eVN0YXRlfSBvbkNoYW5nZT17dGhpcy5jaXR5U3RhdGVDaGFuZ2V9IC8+PC9sYWJlbD5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5mMlN1Ym1pdH0+XG4gICAgICAgICAgPGxhYmVsPlppcDogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT17dGhpcy5zdGF0ZS56aXB9IG9uQ2hhbmdlPXt0aGlzLnppcENoYW5nZX0gLz48L2xhYmVsPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJOZXh0XCIgLz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBGMyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjYzogJycsXG4gICAgICBleHBEYXRlOiAnJyxcbiAgICAgIGN2djogJycsXG4gICAgICBiaWxsaW5nWmlwOiAnJyxcbiAgICB9XG4gICAgdGhpcy5mM1N1Ym1pdCA9IHRoaXMuZjNTdWJtaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNjQ2hhbmdlID0gdGhpcy5jY0NoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZXhwRGF0ZUNoYW5nZSA9IHRoaXMuZXhwRGF0ZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3Z2Q2hhbmdlID0gdGhpcy5jdnZDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbGxpbmdaaXBDaGFuZ2UgPSB0aGlzLmJpbGxpbmdaaXBDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuICBmM1N1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdGMyBzdGF0ZScsIHRoaXMuc3RhdGUpO1xuICAgIHRoaXMucHJvcHMuaGFuZGxlU3VibWl0KHRoaXMuc3RhdGUpO1xuICB9XG4gIGNjQ2hhbmdlKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGNjOiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgfVxuICBleHBEYXRlQ2hhbmdlKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGV4cERhdGU6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG4gIGN2dkNoYW5nZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjdnY6IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9XG4gIGJpbGxpbmdaaXBDaGFuZ2UoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgYmlsbGluZ1ppcDogZS50YXJnZXQudmFsdWUgfSk7XG4gIH1cblxuICAvLyBGMyBjb2xsZWN0cyBjcmVkaXQgY2FyZCAjLCBleHBpcnkgZGF0ZSwgQ1ZWLCBhbmQgYmlsbGluZyB6aXAgY29kZS5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgICA8bGFiZWw+Q3JlZGl0IENhcmQgIzogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiB2YWx1ZT17dGhpcy5zdGF0ZS5jY30gb25DaGFuZ2U9e3RoaXMuY2NDaGFuZ2V9IC8+PC9sYWJlbD5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgICA8bGFiZWw+RXhwIERhdGU6IDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e3RoaXMuc3RhdGUuZXhwRGF0ZX0gb25DaGFuZ2U9e3RoaXMuZXhwRGF0ZUNoYW5nZX0gLz48L2xhYmVsPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICAgIDxsYWJlbD5DVlY6IDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgdmFsdWU9e3RoaXMuc3RhdGUuY3Z2fSBvbkNoYW5nZT17dGhpcy5jdnZDaGFuZ2V9IC8+PC9sYWJlbD5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5mM1N1Ym1pdH0+XG4gICAgICAgICAgPGxhYmVsPkJpbGxpbmcgWmlwOiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXt0aGlzLnN0YXRlLmJpbGxpbmd6aXB9IG9uQ2hhbmdlPXt0aGlzLmJpbGxpbmdaaXBDaGFuZ2V9IC8+PC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiTmV4dFwiIC8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY2xhc3MgUHVyY2hhc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuXG4gICAgfVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgTmFtZToge3RoaXMucHJvcHMuaW5mby5uYW1lfTxwPjwvcD5cbiAgICAgICAgRW1haWw6IHt0aGlzLnByb3BzLmluZm8uZW1haWx9PHA+PC9wPlxuICAgICAgICBQYXNzd29yZDogKioqKjxwPjwvcD5cbiAgICAgICAgU2hpcHBpbmcgQWRkcmVzczoge3RoaXMucHJvcHMuaW5mby5zaGlwcGluZ0FkZHJlc3N9PHA+PC9wPlxuICAgICAgICBDaXR5L1N0YXRlOiB7dGhpcy5wcm9wcy5pbmZvLmNpdHlTdGF0ZX08cD48L3A+XG4gICAgICAgIFppcDoge3RoaXMucHJvcHMuaW5mby56aXB9PHA+PC9wPlxuICAgICAgICBDcmVkaXQgQ2FyZDoge3RoaXMucHJvcHMuaW5mby5jY308cD48L3A+XG4gICAgICAgIEV4cCBEYXRlOiB7dGhpcy5wcm9wcy5pbmZvLmV4cERhdGV9PHA+PC9wPlxuICAgICAgICBDVlY6IHt0aGlzLnByb3BzLmluZm8uY3Z2fTxwPjwvcD5cbiAgICAgICAgQmlsbGluZyBaaXA6IHt0aGlzLnByb3BzLmluZm8uYmlsbGluZ1ppcH08cD48L3A+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJQdXJjaGFzZVwiIC8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7Il19