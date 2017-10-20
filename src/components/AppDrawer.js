import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Blockies from 'react-blockies';
import Identicon from './Identicon'
import { connect } from 'react-redux'

import { spacing, typography } from 'material-ui/styles';
import { white, blue600 } from 'material-ui/styles/colors';
import Assessment from 'material-ui/svg-icons/action/assessment';
import SettingsApplications from 'material-ui/svg-icons/action/settings-applications';

class AppDrawer extends Component {

    render() {

        const styles = {
            logo: {
                cursor: 'pointer',
                fontSize: 22,
                color: typography.textFullWhite,
                lineHeight: `${spacing.desktopKeylineIncrement}px`,
                fontWeight: typography.fontWeightLight,
                backgroundColor: 'rgb(0, 188, 212)',
                paddingLeft: 40,
                height: 64,
            },
            menuItem: {
                color: white,
                fontSize: 14
            },
            avatar: {
                div: {
                    padding: '22px 0 20px 15px',
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)), url(' + require('../images/material_bg.png') + ')',
                    height: 45
                },
                icon: {
                    float: 'left',
                    display: 'block',
                    marginRight: 15,
                },
                span: {
                    paddingTop: 12,
                    display: 'block',
                    color: 'white',
                    fontWeight: 300,
                    textShadow: '1px 1px #444',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '170px',
                    overflow: 'hidden'
                }
            }
        };

        return (
            <Drawer open={this.props.open}>
                <div style={styles.logo}>
                    Suscryption</div>
                <div style={styles.avatar.div}>
                    <div style={styles.avatar.icon} className="blockies-circular">
                        <Identicon
                            diameter={50}
                            address={this.context.accounts[0]}
                        />
                    </div>
                    <span style={styles.avatar.span}>{this.context.accounts[0]}</span>
                </div>
                <MenuItem containerElement={<Link to="/admin" />} leftIcon={<SettingsApplications />}>Deploy</MenuItem>
                <MenuItem leftIcon={<Assessment />} primaryText="Subscryptions" primaryTogglesNestedList={true}
                    nestedItems={
                        this.props.plans.filter(plan => true || plan.owner === this.context.accounts[0]).map(function (plan) {
                            return <MenuItem className="one-line" key={plan.plan} containerElement={<Link to="/admin/dashboard" />}>{plan.plan}</MenuItem>
                        })}
                >
                </MenuItem>

            </Drawer>)
    }
}

AppDrawer.contextTypes = {
    instanceLoaded: PropTypes.bool,
    accounts: PropTypes.array,
    web3: PropTypes.object,
    planRegistryInstance: PropTypes.object,
    PlanShell: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        plans: state.plans.addresses
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppDrawer)