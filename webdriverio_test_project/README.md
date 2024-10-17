debug:

1. add to test block:
await browser.debug()

2. run DEBUG script (it sets timeout to 9999999ms)

3. execution of the test will freeze at browser.debug() line with info: The execution has stopped!

4. To continue test:
press ^C or .exit in terminal