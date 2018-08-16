package uk.gov.justice.digital.hmpps.prisonstaffhub.model

import geb.Browser
import uk.gov.justice.digital.hmpps.prisonstaffhub.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.prisonstaffhub.pages.DashboardPage
import uk.gov.justice.digital.hmpps.prisonstaffhub.pages.LoginPage
import uk.gov.justice.digital.hmpps.prisonstaffhub.pages.SearchPage

import static uk.gov.justice.digital.hmpps.prisonstaffhub.model.UserAccount.ITAG_USER

class TestFixture {

    Browser browser
    Elite2Api elite2Api

    UserAccount currentUser
    List<Location> locations

    TestFixture(Browser browser, Elite2Api elite2Api) {
        this.browser = browser
        this.elite2Api = elite2Api
    }

    def loginAs(UserAccount user) {
        currentUser = user
        elite2Api.stubHealth()

        browser.to LoginPage
        elite2Api.stubValidOAuthTokenRequest currentUser
        elite2Api.stubGetMyDetails currentUser
        elite2Api.stubGetMyCaseloads currentUser.caseloads
        elite2Api.stubGroups currentUser.workingCaseload
        elite2Api.stubActivityLocations()
        browser.page.loginAs currentUser, 'password'
        browser.at SearchPage
    }

    def toSearch() {
        loginAs ITAG_USER
    }

    def clickWhereaboutsLink() {
        browser.at DashboardPage
        browser.page.whereaboutsLink.click()
    }


    static List<Location> locationsForCaseload(Caseload caseload) {
        def agencyLocations = caseload.locations

        List<Location> locations = agencyLocations.collect { Location.toLocation it }
        locations.addAll(agencyLocations.collectMany { agencyLocation ->
            AgencyInternalLocation
                    .childrenOf(agencyLocation)
                    .findAll { it.type == 'WING' }
                    .collect { Location.toLocation it }
        })
        locations
    }
}
