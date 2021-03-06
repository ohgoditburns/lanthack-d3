# lanthack-d3

Working demo on blocks: http://bl.ocks.org/ohgoditburns/raw/afdb58c621042115760c2a74f7446fea/

I've been working for a bit on topic models. In particular, I would like to find a political spectrum scoring for a piece of text. To that end, I scraped roughly 500 articles from a few politically polar publications, and ran a slightly modified latent Dirichlet allocation on them. (Modification means including some n-grams in the bag of words). I then constructed a graph using the correlation of topic assignments as edge weights. This graph is supplied to the d3 application here.

This d3 effort does a few things:

1. Hiveplot display of 3 publications (From 12:00, clockwise: Economist, Jacobin, WND) with links if a topicmodel correlation between documents is > 0.95. 
2. Clicking on a hiveplot node will show in a separate panel that node and all connected nodes. 
3. Clicking on a node in the graph panel will open the article in a new page. Note that the Economist requires a subscription and will only let you see something like 10 articles a month.


- Uses sample code from Mike Bostock under GPL3 license. 
- Uses D3js which is under a BSD license. 
- Uses D3tip which is under an MIT license.
- This code is released under GPL3 license, enjoy!

