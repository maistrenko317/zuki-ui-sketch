#!/bin/bash

LENGTH=100
for i in $(seq 1 ${LENGTH});
do
    NAME="person-${i}.png"
    curl "https://shouttrivia.com/play/assets/img/people/${NAME}" > ${NAME}
done   