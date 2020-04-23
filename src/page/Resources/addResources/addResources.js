import React, { Component } from 'react'
import { Tabs,Card  } from 'antd'
import BasicInfo from './components/basicInfo'
import Document from './components/document'
import { connect } from 'react-redux'
const TabPane = Tabs.TabPane;
class AddResources extends Component {
  state = {  }
  cancel = ()=>{
    this.props.history.push('/home/resourcesList')
  }
  render() { 
    let _this = this
    const{rsType} = this.props
    const rsItem = sessionStorage.getItem('rsItem')
    const type = this.props.location.query.type
    const id = this.props.location.query.id
    const basicProps = {
      rsType: rsType,
      type: type,
      rsItem: rsItem,
      id: id,
      cancelAdd() {
        _this.cancel()
      }
    }
    return ( 
      <div className="contain-wrap">
        <div className="resources">
          <BasicInfo {...basicProps} ref="basicInfo" />
        </div>
      </div>
     );
  }
}
 
function mapStateToProps(state) {
  return {
    rsType: state.filterData.rsType,
  }
}
export default connect(
  mapStateToProps
)(AddResources);