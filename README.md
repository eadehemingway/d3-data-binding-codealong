# D3 workshop

### code along

#### step one - add svg

```js
const svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', 700)
  .attr('height', 500);
```

#### step two - bind data to a selection

```js
const vaseGroups = svg.selectAll('g');
console.log(vaseGroups);
```

show what vaseGroups is. \_parents is the parent node (here svg), \_groups is the current selection (here it is an empty Nodelist because there are no groups on the page)
now we bind it to data:

```js
const vaseGroups = svg.selectAll('g').data(data);
console.log(vaseGroups);
```

this says bind a group node to each bit of data. we have 6 items of data so we need 6 groups. binding data creates an enter and exit property to the selection object relating to how many of the required nodes already exist on the page.
so if we look at vaseGroups now we can see that \_enter: array(6) and \_exit: array(0). This is because we need 6 group nodes to enter for there to be one per item of data. (the exit array would be greater than zero if there were more group nodes on the page than items of data)

so lets call .enter()

```js
const vaseGroups = svg
  .selectAll('g')
  .data(data)
  .enter();
```

nothing happens! why? because .enter() creates a loop, so that whatever you write after it happens for each node in the enter selection. so if you dont put any code after it its like having a for loop with no code inside it.

so lets add the code we want to happen for each node in the enter selection:

```js
const vaseGroups = svg
  .selectAll('g')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'vase');

console.log(vaseGroups);
```

now if we look in the browser we can see that we have six group elements with class 'vase' inside the svg.
if we look at the console we can see that vaseGroups now no longer has \_enter and \_exit because by calling .enter().append('g') we pass the selection on to each of the group elements.
if we open up one of the group elements in the \_groups object and go all the way down to **data** we can see the data that is bound to that group element.

so we now have vaseGroups, a variable that refers to 6 group elements on the page, each one bound to an item of our data.

#### step 3 - add vase rects

```js
const margin = 230;
const padding = 60;
const vaseWidth = 15;
const vaseY = 300;

const vaseGroups = svg
  .selectAll('g')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'vase')
  .append('rect')
  .attr('class', 'vase')
  .attr('width', vaseWidth)
  .attr('height', d => d.height)
  .attr('x', (_, i) => i * padding + margin)
  .attr('y', d => vaseY - d.height)
  .attr('fill', 'none')
  .attr('stroke', d => d.color);
```

so this adds rectangles to each group, and uses the data bound to the group to determine the height and colour.

#### step 4 - add liquid rects

we now need to add another rectange to each group to present the liquid in the vase. This rect will also need to use the data to determine its height and colour. We cannot add a rect element to a rect element (which is what happened if we tried to chain it to vaseGroups, because the current selection is a selection of rect elements).

this time we dont need to bind the data to the group elements because it is already bound, and we dont need to enter any elements because there are already the right amount on the page. so we can just select all groups and add the rects

```js
const liquid = svg
  .selectAll('g')
  .append('rect')
  .attr('class', 'liquid')
  .attr('width', vaseWidth)
  .attr('height', d => d.liquidHeight)
  .attr('x', (_, i) => i * padding + margin)
  .attr('y', d => vaseY - d.liquidHeight)
  .attr('fill', d => d.color);
```

note that
`svg.selectAll('g')` when there are 6 'g' on the page will return the same thing as

```js
svg
  .selectAll('g')
  .data(data)
  .enter()
  .append('g');
```

when there are 6 items in data. They both return a selection of 6 group elements. the first will be nodelist and the second an array but in practice they are the same thing (a selection of 6 group elements)

console log them both to show this.

#### step 5 - refactor

if we separate the code well, into useful variables it avoids repetition so lets refactor this to:

```js
const vaseGroups = svg
  .selectAll('g')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'vase');

vaseGroups
  .append('rect')
  .attr('class', 'vase')
  .attr('width', vaseWidth)
  .attr('height', d => d.height)
  .attr('x', (_, i) => i * padding + margin)
  .attr('y', d => vaseY - d.height)
  .attr('fill', 'none')
  .attr('stroke', d => d.color);

vaseGroups
  .append('rect')
  .attr('class', 'liquid')
  .attr('width', vaseWidth)
  .attr('height', d => d.liquidHeight)
  .attr('x', (_, i) => i * padding + margin)
  .attr('y', d => vaseY - d.liquidHeight)
  .attr('fill', d => d.color);
```

#### step 6 - add event listeners for buttons

add eventlistener for increase button that updates the data

```js
const increaseButton = document.querySelector('#increase');
increaseButton.addEventListener('click', () => {
  const newData = data.map(d => {
    const plusTen = d.liquidHeight + 10;
    const newLiquidHeight = plusTen > d.height ? d.height : plusTen;
    return { ...d, liquidHeight: newLiquidHeight };
  });
  data = newData;
});
```

nothing happens yet cos we the data is not being used after it is updated.
so we need to rebind the data to the groups
so add:

```js
vaseGroups.data(newData);
```

still nothing happens - why? because we have to retrigger the values that are being altered, so now we add:

```js
vaseGroups
  .select('rect.liquid')
  .attr('height', d => d.liquidHeight)
  .attr('y', d => vaseY - d.liquidHeight);
```

now duplicate this code and alter for decrease so that we have

```js
const increaseButton = document.querySelector('#increase');
increaseButton.addEventListener('click', () => {
  const newData = data.map(d => {
    const plusTen = d.liquidHeight + 10;
    const newLiquidHeight = plusTen > d.height ? d.height : plusTen;
    return { ...d, liquidHeight: newLiquidHeight };
  });
  data = newData;
  vaseGroups.data(newData);
  vaseGroups
    .select('rect.liquid')
    .attr('height', d => d.liquidHeight)
    .attr('y', d => vaseY - d.liquidHeight);
});

const decreaseButton = document.querySelector('#decrease');
decreaseButton.addEventListener('click', () => {
  const newData = data.map(d => {
    const minusTen = d.liquidHeight - 10;
    const newLiquidHeight = minusTen > 0 ? minusTen : 0;
    return { ...d, liquidHeight: newLiquidHeight };
  });

  data = newData;
  vaseGroups.data(newData);
  vaseGroups
    .select('rect.liquid')
    .attr('height', d => d.liquidHeight)
    .attr('y', d => vaseY - d.liquidHeight);
});
```

#### step 7 - refactor

we can see that we have some duplication in the eventlisteners so lets abstract that into a function

```js
const updateLiquid = newData => {
  vaseGroups.data(newData);
  vaseGroups
    .select('rect.liquid')
    .attr('height', d => d.liquidHeight)
    .attr('y', d => vaseY - d.liquidHeight);
};

const increaseButton = document.querySelector('#increase');
increaseButton.addEventListener('click', () => {
  const newData = data.map(d => {
    const plusTen = d.liquidHeight + 10;
    const newLiquidHeight = plusTen > d.height ? d.height : plusTen;
    return { ...d, liquidHeight: newLiquidHeight };
  });
  data = newData;
  updateLiquid(newData);
});

const decreaseButton = document.querySelector('#decrease');
decreaseButton.addEventListener('click', () => {
  const newData = data.map(d => {
    const minusTen = d.liquidHeight - 10;
    const newLiquidHeight = minusTen > 0 ? minusTen : 0;
    return { ...d, liquidHeight: newLiquidHeight };
  });

  data = newData;
  updateLiquid(newData);
});
```

this now updates the liquid but does so without a smooth transition.
add transition() and duration() to updateLiquid func so it looks like this:

```js
const updateLiquid = newData => {
  vaseGroups.data(newData);
  vaseGroups
    .select('rect.liquid')
    .transition()
    .duration(750)
    .attr('height', d => d.liquidHeight)
    .attr('y', d => vaseY - d.liquidHeight);
};
```

now it should all work!!
