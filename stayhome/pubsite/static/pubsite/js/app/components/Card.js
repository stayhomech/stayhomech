import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';

const CategoryBadge = props => {

    return (<span>ToDo</span>)

    return (
    <span className="badge badge-secondary">{props.category.parent.name} / {props.category.name}</span>
    )

}

const DeliversToList = props => {

    //{% include 'includes/deliver_to_list.html' with business=business %}
    return (<span>ToDo</span>)

}

const Card = props => {

    const { t, i18n } = useTranslation();

    const all_categories = [props.main_category].concat(props.other_categories);
    const categories_badges = all_categories.map((category) =>
        <CategoryBadge category={category} key={category.id} />
    );

    const description = (props.description == '') ? t('No description') : props.description;

    return (
        <div className="sh-card">
            <div className="card-header">
                {categories_badges}
                <span className="float-right small">{t('Located at')} {props.location_npa} {props.location_name}</span>
            </div>
            <div className="card-body">
                <Row mb="2">
                    <Col xs="12">
                    <h1 className="h5 card-title mb-0">{ props.name }</h1>
                    </Col>
                </Row>
                <Row m="0" p="0">
                    <Col xs="12" m="0" p="0" className="card-description sh-crop">
                        {description}
                    </Col>
                </Row>
                <Row my="2">
                    <Col xs="12">
                        <Row>
                            <Col xs="12" className="small">
                                <a className="float-right sh-report" href="#"><FontAwesomeIcon icon={faBug} className="mr-1"></FontAwesomeIcon>{t('Report an issue')}</a>
                                {(props.website != '') &&
                                    <p>
                                        <span className="font-weight-bold">{t('Website')}</span><br/>
                                        <a href={props.website} target="_blank">{props.website}</a>
                                    </p>
                                }
                                {(props.phone != '') &&
                                <p>
                                    <span className="font-weight-bold">{t('Phone')}</span><br/>
                                    <a href={"tel:" + props.phone}>{ props.phone }</a>
                                </p>
                                }
                                {(props.email != '') &&
                                <p>
                                    <span className="font-weight-bold">{t('Email')}</span><br/>
                                    <a href={"mailto:" + props.email }>{ props.email }</a>
                                </p>
                                }
                                <p>
                                    <span className="font-weight-bold">{t('Where is this service available ?')}</span><br />
                                    <DeliversToList business={props} />
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <ButtonGroup size="sm" flexWrap="1">

                </ButtonGroup>
            </div>
        </div>
    )

}

export {
    Card
}