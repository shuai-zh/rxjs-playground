import { Observable } from "rxjs";
import { load, loadWithFetch } from "./loader";

var i = 0;
function getOrders() {
    return new Promise((resolve, reject) => {
        if (i > 3) {
            reject("GET ORDERS FAILED");
        } else {
            resolve([{
                id: 1
            }, {
                id: 2
            }]);
        }
        i += 1;
    });
}

function getFxOrdersFromServiceAsObservable() {
    return Observable.defer(() =>
        getOrders()
            .catch(e => console.log(`CAUGHT ERROR when getting orders`, e))
    );
}

function getRefdata(item) {
    let counter = 0;
    return Observable.defer(() =>
        new Promise((resolve, reject) => {
            if (counter++ < 10) {
                item["refdata"] = item.id * 2;
                resolve(item);
            } else {
                reject("GET REFDATA FAILED");
            }
        })
            .catch(e => console.log(`CAUGHT ERROR when getting refdata`, e))
    );
}

function flatten(x) {
    return x;
}


let source = Observable
    .interval(5000)
    .startWith(0)
    .flatMap(x => getFxOrdersFromServiceAsObservable())
    .flatMap(x => flatten(x))
    .switchMap(x => getRefdata(x))
    .retry(3);



// let source = Observable.merge(
//     Observable.of(1),
//     Observable.from([2, 3, 4]),
//     Observable.throw(new Error("STOP!!")),
//     Observable.of(10)
// ).catch(e => {
//     console.log(`caught: ${e}`);
//     return Observable.of(100);
// })

source.subscribe(value => console.log(`value:`, value),
    e => console.log(`error: ${e}`),
    () => console.log("COMPLETE"));



// let output = document.getElementById("output");
// let button = document.getElementById("button");

// let click = Observable.fromEvent(button, "click");

// function renderMovies(movies) {
//     movies.forEach(m => {
//         let div = document.createElement("div");
//         div.innerText = m.title;
//         output.appendChild(div);
//     });
// }

// click.flatMap(e => loadWithFetch("movies.json"))
//     .subscribe(renderMovies,
//     e => console.log(`error: ${e}`),
//     () => console.log("complete")
//     );

// let subscription =
//     load("moviess.json")
//         .subscribe(renderMovies,
//         e => console.log(`error: ${e}`),
//         () => console.log("complete")
//         );

// subscription.unsubscribe();