let svg = document.querySelector('.name-svg');
let altSvg = document.querySelector('.name-svg-alt');
let parentDiv = document.querySelector('.parent-div')
let altParentDiv = document.querySelector('.parent-div-alt')
let navBrand = document.querySelector('.nav')
let navBrandAlt = document.querySelector('.nav-alt')

if (svg) {
    svg.addEventListener('click', () => {
        parentDiv.classList.toggle('hidden');
        altParentDiv.classList.toggle('hidden');
    })
    altSvg.addEventListener('click', () => {
        parentDiv.classList.toggle('hidden');
        altParentDiv.classList.toggle('hidden');
    })
}
navBrand.addEventListener('click', () => {
    navBrand.classList.toggle('hidden');
    navBrandAlt.classList.toggle('hidden');
})
navBrandAlt.addEventListener('click', () => {
    navBrand.classList.toggle('hidden');
    navBrandAlt.classList.toggle('hidden');
})