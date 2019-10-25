(async function() {
    // Match topics.
    if (window.location.href.startsWith("https://scratch.mit.edu/discuss/topic/")) {
        // This is very hard to read.
        // - bybb
        function parseDate(d) { // Who wrote this?
            d = new Date(d); // Nice magic number
            let hour = (d.getHours() + 24) % 12 || 12
            if (d.getHours() < 12) {
                var tt = " AM"
                } else {
                    tt = " PM"
                }
            var realhour = d.getMonth() + 1 // Why is this a thing?!?!?
            return + d.getDate() + "/" + realhour + "/" + d.getFullYear() + " " + hour + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2) + tt // Aight
        }

        // To whomever it may concern, please indent your JavaScript, thanks!
        // - bybb
        function httpGetAsync(theUrl) {
            return new Promise(resolve => {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() {
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                        resolve(xmlHttp.responseText);
                    }
                }
                xmlHttp.open("GET", theUrl, true);
                xmlHttp.send(null);
            });
        }

        // We're going to use a Generator for this for the sake of readability
        function* makePostLeftIter() {
            let postlefts = document.getElementsByClassName("postleft");
            for (let postLeft in postlefts) {
                yield postlefts[postLeft];
            }
        }

        let postLeftIter = makePostLeftIter();
        let currentPostLeft = postLeftIter.next();

        // Helper Functions:
        function unameFromPostLeft() {return currentPostLeft.value.children[0].children[0].children[0].innerHTML;}
        function addData(data) {currentPostLeft.value.children[0].innerHTML += "<br>" + data;}
        function changeData(from, to) {currentPostLeft.value.children[0].innerHTML.replace(from, to);}
        function addBottomData(data) {currentPostLeft.value.parentElement.children[4].children[0].innerHTML += "<li>| " + data + " </li>";}
        function getPostId() {return currentPostLeft.value.parentElement.parentElement.parentElement.id.substr(1)}

        // "Cache"
        let userCache = {}

        while (!currentPostLeft.done) {
            // Auxiliary Variables for Data we Don't Want to Generate Again
            let username = unameFromPostLeft();
            let postid = getPostId();

            // We don't want to create a DDoS script for poor DatOneLefty's servers :P
            if (userCache[username] == null) {
                userCache[username] = JSON.parse(await httpGetAsync("https://forums.scratchstats.com/v1/user/" + username + "/info"));
            }

            // User unto Oneself.
            let user = userCache[username];

            // Finally Add Sidebar Data.
            addData("")
            addData("Username: " + username);
            addData("First Seen: " + parseDate(user.firstseen));
            addData("Last Seen: " + parseDate(user.lastseen));
            addData("Query Time: " + user.query_time);
            addData("Post Id: " + getPostId());
            
            // Change Sidebar Data.
            changeData(/[0-9]+.+ posts/g, user.post_count + " post" + "s".repeat(0+(user.postcount!=1))

            // Add Bottom Bar Data.
            addBottomData("<a href=\"https://forums.scratchstats.com/post/" + getPostId() + "/\">Permalink</a>");
            addBottomData("<a href=\"https://forums.scratchstats.com/user/" + username + "/\">User</a>");

            // Move to next.
            currentPostLeft = postLeftIter.next();
        }
    }
})();
