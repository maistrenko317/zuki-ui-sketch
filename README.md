# ZUKI UI SKETCH #
## Zuki UI Sketch (Visual Language for Zuki) ##

This project contains rebranded HTML/CSS for [admin](https://github.com/resultier/zuki-workspace-shoutgame/tree/master/SnowyOwlAdmin) and [game](https://github.com/resultier/zuki-workspace-shoutgame/tree/master/SnowyOwlHtml5) sites.


## Passwords to npm repositories ##

1. official npm: rafael.????.solano (rafael.solano@mqa????????.com) Vasorange#1205
2. fontawesome pro: Follow [official process](https://fontawesome.com/docs/web/setup/packages) to install packages.

## Using React 16+ Components inside Angular 2 ##

Is easy to grasp the general process after reading the follosing pages

1. [How to Use React Components in Angular 2+](https://blog.harveydelaney.com/integrating-react-components-into-an-angular-2-project)
2. [Integrating React Components into an Angular 2+ Project](https://sdk.gooddata.com/gooddata-ui/docs/4.1.1/ht_use_react_component_in_angular_2.x.html)
3. [Compile TSX in Angular projects](https://stackoverflow.com/questions/50432556/cannot-use-jsx-unless-the-jsx-flag-is-provided)

## Accessing Remote Database ##

1. Create an SSH tunnel

```
$ ssh -i zuki-ec2.pem -N -L 53306:172.31.52.127:53847 meinc@52.70.76.197
```

2. Open mysql without ssl.
```
mysql -u meinc -p -h 127.0.0.1 -P 53306 --ssl-mode=DISABLED
```

## Staging URLS ##

1. [Play](https://zuki.resultier.dev)
2. [Admin](https://admin.zuki.resultier.dev)#   z u k i - u i - s k e t c h  
 