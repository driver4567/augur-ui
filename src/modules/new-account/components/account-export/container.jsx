import { connect } from 'react-redux'

import AccountExport from 'modules/new-account/components/account-export/account-export'

import { selectLoginAccount } from 'modules/auth/selectors/login-account'

const mapStateToProps = state => {
  const loginAccount = selectLoginAccount(state)

  return {
    loginAccount,
    privateKey: state.loginAccount.accountPrivateKey,
    downloadAccountDataString: loginAccount.downloadAccountDataString,
    downloadAccountFileName: loginAccount.downloadAccountFileName
  }
}

const AccountExportContainer = connect(mapStateToProps)(AccountExport)

export default AccountExportContainer
