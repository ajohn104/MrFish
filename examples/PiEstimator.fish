declare inputNumPoints as 1E10
declare inputWidth as 2

type Point:
    Creation needs (x, y):
        this.x = x
        this.y = y

function DistanceTo needs (point):
    provide (point.x^2 + point.y^2)^0.5

function RandomPoint needs (width):
    provide new Point with (x = width * random() - width/2, y = width * random() - width/2)

function DeterminePi needs (numPoints, width):
    declare totalIn = 0
    declare radius = width/2
    foreach (i in range(numPoints)):
        if (DistanceTo with (point = RandomPoint with (width = width)) <= radius):
            totalIn = totalIn + 1

    declare ratio = totalIn / numPoints
    declare areaOfSquare = width^2
    provide ratio * areaOfSquare / (radius^2);

Output with (text = DeterminePi(numPoints = inputNumPoints, width = inputWidth))