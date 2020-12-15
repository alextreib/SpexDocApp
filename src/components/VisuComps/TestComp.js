/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import { withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const filter = createFilterOptions();

class AutoCompletionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      options:this.props.AutoCompOptions.Options
    };
  }

  addValueToOptionList = (newValue) => {
    this.props.AutoCompOptions.Options.push({title: newValue, year:2020});
  };

  render() {
    const { classes } = this.props;

    return (
      <Autocomplete
        value={this.state.value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            this.addValueToOptionList(newValue.inputValue);
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            console.log(newValue);
            this.addValueToOptionList(newValue.inputValue);
          } else {
            this.addValueToOptionList(newValue.inputValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              title: `"${params.inputValue}" hinzufügen`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={this.props.AutoCompOptions.Options}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
        renderOption={(option) => option.title}
        style={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Kategorie"
            variant="outlined"
          />
        )}
      />
    );
  }
}
export default withStyles(styles)(AutoCompletionForm);
