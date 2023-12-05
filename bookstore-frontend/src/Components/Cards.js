import { Card } from 'semantic-ui-react';
import '../res/css/Cards.css'
import React from 'react';

const Cards = ({ cardsPerRow = 3, items = [] }) => {
    const cards = []
    items.map((item) => {
        cards.push(
            <Card key={item.id}
                href={item.linkTo || ''}
                //style= {{width : `400px/${cardsPerRow}`}} 
                className="card">
                <Card.Content>
                    <Card.Header className='card-title'>{item.title}</Card.Header>
                    <Card.Description className='card-value'>
                       <div className={item.title}>{item.value}</div> 
                    </Card.Description>
                </Card.Content>
            </Card>
            )
    })
    return (
        <div className="card-container">
            {cards}
        </div>
    )
}
export default Cards;