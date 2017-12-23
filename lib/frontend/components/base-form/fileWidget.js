import React, { Component } from "react";

import { dataURItoBlob, shouldRender, setState } from "./utils";

function addNameToDataURL(dataURL, name) {
  return dataURL.replace(";base64", `;name=${name};base64`);
}

function processFile(file) {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = event => {
      resolve({
        dataURL: addNameToDataURL(event.target.result, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}

function processFiles(files) {
  return Promise.all([].map.call(files, processFile));
}

function FilesInfo(props) {
  const { filesInfo } = props;
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <span className="file-name">
      {filesInfo.map((fileInfo, key) => {
        const { name, size, type } = fileInfo;
        return (
          <span key={key}>
            <strong>{name}</strong> ({type}, {size} bytes)
          </span>
        );
      })}
    </span>
  );
}

function extractFileInfo(dataURLs) {
  return dataURLs
    .filter(dataURL => typeof dataURL !== "undefined")
    .map(dataURL => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        name: name,
        size: blob.size,
        type: blob.type,
      };
    });
}

class FileWidget extends Component {
  static defaultProps = {
    multiple: false,
  };

  constructor(props) {
    super(props);
    const { value } = props;
    const values = Array.isArray(value) ? value : [value];
    this.state = { values, filesInfo: extractFileInfo(values) };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onChange = event => {
    const { multiple, onChange } = this.props;
    processFiles(event.target.files).then(filesInfo => {
      const state = {
        values: filesInfo.map(fileInfo => fileInfo.dataURL),
        filesInfo,
      };
      setState(this, state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });
  };

  render() {
    const { multiple, id, readonly, disabled, autofocus, options } = this.props;
    const { filesInfo } = this.state;
    let className = options.className || ''
    return (
      <div className={"file has-name is-boxed " + className}>
        <label className="file-label">
          <input
            className='file-input'
            ref={ref => (this.inputRef = ref)}
            id={id}
            type="file"
            disabled={readonly || disabled}
            onChange={this.onChange}
            defaultValue=""
            autoFocus={autofocus}
            multiple={multiple}
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fa fa-upload"></i>
            </span>
            <span className="file-label">
              Choose a file…
            </span>
          </span>
          <FilesInfo filesInfo={filesInfo} />
        </label>
      </div>
    )
  }
}


export default FileWidget;