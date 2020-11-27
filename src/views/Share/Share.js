/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Switch from "@material-ui/core/Switch";
import LoginAlert from "components/LoginAlert/LoginAlert.js";


import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// todo: import ?
var QRCode = require("qrcode.react");
// Both versions
const BitlyClient = require("bitly").BitlyClient;
const bitly = new BitlyClient("10f3147740e04fd0ea4c68788a84147cc6034dfa");

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

// Display Login Screen here -> Login from Profile NavBar should also point here
class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openLoginRequired:false,
      emergency: {
        QRCodeactive: false,
        Switchactive: false,
        shortLink: "",
      },
      medRecords: {
        QRCodeactive: false,
        Switchactive: false,
        shortLink: "",
      },
    };

    //Bindings
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = async (property, event) => {
    var checked = event.target.checked;

    var user = firebase.auth().currentUser;
    if (user == null) {
      this.setState({
        openLoginRequired: true,
      });
      return;
    }
    var user_id = user.uid;

    var longLink =
      "https://app.spexdoc.net/admin/" + property + "/publicKey=" + user_id;
    const response = await bitly.shorten(longLink);
    const shortLink = response.link;

    this.setState({
      [property]: {
        shortLink: shortLink,
        Switchactive: checked,
        QRCodeactive: checked,
      },
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Card>
        <LoginAlert loginState={this.state} />
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Freigaben</h4>
          <p className={classes.cardCategoryWhite}>
            Verwalte und teile deine Freigaben
          </p>
        </CardHeader>
        <CardBody>
          <div id="Emergency">
            Notfalldaten
            <Switch
              checked={this.state.emergency.Switchactive}
              onChange={(ev) => this.handleChange("emergency", ev)}
              color="secondary"
              name="Emergency_switch"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
            {/* todo: Layout without br and maybe one component */}
            <br />
            <br />
            {this.state.emergency.QRCodeactive ? (
              <div>
                <QRCode
                  value={this.state.emergency.shortLink}
                  size={250}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={true}
                  renderAs={"svg"}
                  imageSettings={{
                    src:
                      "https://spexdoc.net/wp-content/uploads/2020/07/SpexDoc_logo_png.png",
                    x: null,
                    y: null,
                    height: 25,
                    width: 25,
                    excavate: true,
                  }}
                />
                <br />
                <a href={this.state.emergency.shortLink}>
                  {this.state.emergency.shortLink}
                </a>
              </div>
            ) : null}
          </div>
          <div id="medRecords">
            Befunde
            <Switch
              checked={this.state.medRecords.Switchactive}
              onChange={(ev) => this.handleChange("medRecords", ev)}
              color="primary"
              name="medRecords_switch"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
            <br />
            <br />
            {this.state.medRecords.QRCodeactive ? (
              <div>
                <QRCode
                  value={this.state.medRecords.shortLink}
                  size={250}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={true}
                  renderAs={"svg"}
                  imageSettings={{
                    src:
                      "https://spexdoc.net/wp-content/uploads/2020/07/SpexDoc_logo_png.png",
                    x: null,
                    y: null,
                    height: 25,
                    width: 25,
                    excavate: true,
                  }}
                />
                <br />
                <a href={this.state.medRecords.shortLink}>
                  {this.state.medRecords.shortLink}
                </a>
              </div>
            ) : null}
          </div>
        </CardBody>
      </Card>
    );
  }
}

Share.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Share);
