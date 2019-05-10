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
        billingZip: '',
      },
    }
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
      return (
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Checkout" />
        </form>
      )
    } else if (this.state.currentForm === 1) {
      return (
        <div>
          <F1 handleSubmit={this.handleSubmit} />
        </div>
      )
    } else if (this.state.currentForm === 2) {
      return (
        <div>
          <F2 handleSubmit={this.handleSubmit} />
        </div>
      )
    } else if (this.state.currentForm === 3) {
      return (
        <div>
          <F3 handleSubmit={this.handleSubmit} />
        </div>
      )
    } else if (this.state.currentForm === 4) {
      return (
        <div>
          <Purchase info={this.state.info} handleSubmit={this.handleSubmit} />
        </div>
      )
    }
  }
}

class F1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
    }
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
    return (
      <div>
        <form>
          <label>Name: <input type="text" name="name" value={this.state.name} onChange={this.nameChange} /></label>
        </form>
        <form>
          <label>Email: <input type="text" name="name" value={this.state.email} onChange={this.emailChange} /></label>
        </form>
        <form onSubmit={this.f1Submit}>
          <label>Password: <input type="text" name="name" value={this.state.password} onChange={this.passwordChange} /></label>
          <input type="submit" value="Next" />
        </form>
      </div>
    );
  }
}

class F2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingAddress: '',
      cityState: '',
      zip: '',
    }
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
    return (
      <div>
        <form>
          <label>Shipping Address: <input type="text" name="name" value={this.state.shippingAddress} onChange={this.shippingAddressChange} /></label>
        </form>
        <form>
          <label>City/State: <input type="text" name="name" value={this.state.cityState} onChange={this.cityStateChange} /></label>
        </form>
        <form onSubmit={this.f2Submit}>
          <label>Zip: <input type="text" name="name" value={this.state.zip} onChange={this.zipChange} /></label>
          <input type="submit" value="Next" />
        </form>
      </div>
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
      billingZip: '',
    }
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
    return (
      <div>
        <form>
          <label>Credit Card #: <input type="text" name="name" value={this.state.cc} onChange={this.ccChange} /></label>
        </form>
        <form>
          <label>Exp Date: <input type="text" name="name" value={this.state.expDate} onChange={this.expDateChange} /></label>
        </form>
        <form>
          <label>CVV: <input type="text" name="name" value={this.state.cvv} onChange={this.cvvChange} /></label>
        </form>
        <form onSubmit={this.f3Submit}>
          <label>Billing Zip: <input type="text" name="name" value={this.state.billingzip} onChange={this.billingZipChange} /></label>
          <input type="submit" value="Next" />
        </form>
      </div>
    );
  }
}

class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <div>
        Name: {this.props.info.name}<p></p>
        Email: {this.props.info.email}<p></p>
        Password: ****<p></p>
        Shipping Address: {this.props.info.shippingAddress}<p></p>
        City/State: {this.props.info.cityState}<p></p>
        Zip: {this.props.info.zip}<p></p>
        Credit Card: {this.props.info.cc}<p></p>
        Exp Date: {this.props.info.expDate}<p></p>
        CVV: {this.props.info.cvv}<p></p>
        Billing Zip: {this.props.info.billingZip}<p></p>
        <form>
          <input type="submit" value="Purchase" />
        </form>
      </div>
    )
  }
}

export default App;