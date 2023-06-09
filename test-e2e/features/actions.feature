Feature: actions

  Background:
    When I open '$actionsPage' url

  Scenario: click
    When I click 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: force click
    When I force click 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: right click
    When I right click 'Button'
    Then I expect text of 'Action' to be equal 'rightclick'

  Scenario: double click
    When I double click 'Button'
    Then I expect text of 'Action' to be equal 'dblclick'

  Scenario: type
    When I type 'test value' to 'Input'
    Then I expect text of 'Action' to be equal 'test value'

  Scenario: clear
    When I type 'test value' to 'Input'
    When I clear 'Input'
    Then I expect 'value' property of 'Input' to be equal ''

  Scenario Outline: click in collection by text (<value>)
    When I click '<value>' text in 'Buttons' collection
    Then I expect text of 'Action' to be equal 'Button2'

    Examples:
      | value    |
      | Button2  |
      | $button2 |

  Scenario: switch to frame
    When I expect 'Button' to be visible
    When I expect 'Frame Element' not to be visible
    When I switch to 1 frame
    When I expect 'Button' not to be visible
    When I expect 'Frame Element' to be visible
    When I switch to parent frame
    When I expect 'Button' to be visible
    When I expect 'Frame Element' not to be visible

  Scenario: switch to tab by title
    When I click 'New Tab Link'
    When I wait 1000 ms
    When I switch to 'Frame' window
    Then I expect current url to be equal '$framePage'
    When I expect 'Frame Element' to be visible

  Scenario: refresh page
    When I type 'test value' to 'Input'
    Then I expect text of 'Action' to be equal 'test value'
    When I refresh page
    Then I expect text of 'Action' to be equal 'Nothing'

  Scenario: press key
    When I press 'w' key
    Then I expect text of 'Action' to be equal 'keypress'

  Scenario: press key with modifier
    And I press 'Alt+a' key
    Then I expect text of 'Key Dump' to contain '"keyCode":65'
    Then I expect text of 'Key Dump' to contain '"altKey":true'

  Scenario Outline: press <key> key multiple times
    When I press '<key>' key <times> time<postfix>
    Then I expect text of 'Press Counter' to contain '<result>'
    Then I expect text of 'Key Dump' to contain '"keyCode":<keycode>'

    Examples:
      | key   | times | postfix | result  | keycode |
      | Enter | 1     |         | 1 times | 13      |
      | Space | 5     | s       | 5 times | 32      |

  Scenario: hover
    When I hover over 'Button Hover'
    Then I expect text of 'Action' to be equal 'hover'

  Scenario: select option by text
    When I select 'two' option from 'Select' dropdown
    Then I expect text of 'Action' to be equal 'select two'

  Scenario: select input by index
    When I select 2 option from 'Select' dropdown
    Then I expect text of 'Action' to be equal 'select two'

  Scenario: scroll in window
    When I scroll by '0, 100'
    And I execute 'window.scrollX' function and save result as 'scrollX'
    And I execute 'window.scrollY' function and save result as 'scrollY'
    Then I expect '$scrollX' memory value to be equal '$number(0)'
    Then I expect '$scrollY' memory value to be equal '$number(100)'

  Scenario: scroll in element
    When I scroll by '0, 50' in 'Overflow Container'
    And I execute 'document.querySelector("#overflowContainer").scrollLeft' function and save result as 'scrollX'
    And I execute 'document.querySelector("#overflowContainer").scrollTop' function and save result as 'scrollY'
    Then I expect '$scrollX' memory value to be equal '$number(0)'
    Then I expect '$scrollY' memory value to be equal '$number(50)'

  Scenario: type in ignore hierarchy component
    When I type 'test value' to 'IgnoreHierarchyComponent > Input'
    Then I expect text of 'Action' to be equal 'test value'

  Scenario: type in component without selector
    When I type 'test value' to 'Component Without Selector > Input'
    Then I expect text of 'Action' to be equal 'test value'

  Scenario: upload file
    When I upload '$uploadFile' file to 'File Input'
    Then I expect 'value' property of 'File Input' to equal 'C:\fakepath\actions.html'

  Scenario: accept alert
    And I will accept alert
    When I click 'Alert Button'
    And I wait 3000 ms
    Then I expect text of 'Action' to be equal 'true'

  Scenario: dismiss alert
    And I will dismiss alert
    When I click 'Alert Button'
    And I wait 3000 ms
    Then I expect text of 'Action' to be equal 'false'

  Scenario: type text to alert
    When I expect text of 'Action' to be equal 'Nothing'
    And I will type 'I am not a robot' to alert
    And I click 'Prompt Button'
    And I wait 3000 ms
    Then I expect text of 'Action' to be equal 'I am not a robot'
