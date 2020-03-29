import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Row, 
    Col, 
    ButtonGroup, 
    Badge 
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faPlusSquare, faMinusSquare, faLink, faPhone } from '@fortawesome/free-solid-svg-icons';
import BugReportIcon from '@material-ui/icons/BugReport';

import { SearchContext } from './Filters';


const CategoryBadge = props => {

    return (
        <Badge color="secondary" className={props.className}>{props.category.parent.name} / {props.category.name}</Badge>
    )

}

const DeliversToList = props => {

    const { t, i18n } = useTranslation();

    const b = props;

    var items = [];

    // Delivers to CH
    if (b.delivers_to_ch) {
        items.push(
            <Badge color="light" key="delivers_to_ch" className="mr-1">
                <img src="/static/pubsite/img/favicon.png" className="mr-1" style={{ height: '1em'}} />
                {t('Everywhere in Switzerland')}
            </Badge>
        )
    }

    // Cantons
    b.delivers_to_canton.map((canton) => {
        items.push(
            <Badge color="light" key={"delivers_to_canton_" + canton.id} className="mr-1">
                <img src={"/static/pubsite/img/flags/" + canton.code + ".png"} className="mr-1" style={{ height: '1em'}} />
                {canton.name}
            </Badge>
        )
    })

    // District
    b.delivers_to_district.map((district) => {
        items.push(
            <Badge color="light" key={"delivers_to_district_" + district.id} className="mr-1">
                {t('District of ') + " " + district.name}
            </Badge>
        )
    })

    // Municipality
    b.delivers_to_municipality.map((municipality) => {
        items.push(
            <Badge color="light" key={"delivers_to_municipality_" + municipality.id} className="mr-1">
                {municipality.name}
            </Badge>
        )
    })

    // NPA
    b.delivers_to.map((npa) => {
        items.push(
            <Badge color="light" key={"delivers_to_npa_" + npa.id} className="mr-1">
                {npa.npa + " " + npa.name}
            </Badge>
        )
    })

    return items;

}


const Card = props => {

    const { t, i18n } = useTranslation();

    const [expanded, setExpanded] = useState(false);
    const [details, setDetails] = useState(false);
    const [error, setEror] = useState(null);

    // Expand content
    const setExpandedHandler = (e) => {

        e.preventDefault();

        // Already expanded, collapse
        if (expanded) {
            return setExpanded(false);
        }

        // Fetch details if needed
        if (!details) {
            fetch("/business/" + props.lang + "/" + props.id + "/")
                .then(res => res.json())
                .then(
                    (result) => {
                        setDetails(result);
                        setExpanded(true);
                    },
                    (error) => {
                        setEror(error);
                    }
                )
        } else {

            // Expand
            setExpanded(true);

        }
            
    }

    // Use Page function to report an issue in a modal
    const reportIssue = (e) => {
        e.preventDefault();
        props.reportIssue(props);
    }

    // List of other categories
    const other_categories_badges = props.other_categories.map((category) =>
        <CategoryBadge category={category} key={category.id} className="mr-1" />
    );

    // Phone
    var new_phone = false;
    if (props.phone != '') {
        var regex = /\+41([0-9]{2})([0-9]{3})([0-9]{2})([0-9]{2})/;
        var m = regex.exec(props.phone);
        if (m !== null) {
            new_phone = '0' + m[1] + ' ' + m[2] + ' ' + m[3] + ' ' + m[4];
        }
    }

    return (
        <div className="sh-card">
            <div className="card-header">
                <CategoryBadge category={props.main_category} />
                <span className="small float-right">{props.location_npa} {props.location_name}</span>
            </div>
            <div className="card-body">
                <Row>
                    <Col xs="12">
                        <h1 className="h5 card-title mb-1">{ props.name }</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" className="card-description mb-2">
                        { expanded ? details.description : props.description }
                    </Col>
                </Row>

                { expanded &&
                <Row my="2">
                    <Col xs="12">
                        <Row>
                            <Col xs="12" className="small">
                                {(props.other_categories.length > 0) &&
                                    <p>
                                        <span className="font-weight-bold">{t('Other categories')}</span><br/>
                                        { other_categories_badges }
                                    </p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="4" className="small">
                                {(details.website != '') &&
                                    <p>
                                        <span className="font-weight-bold">{t('Website')}</span><br/>
                                        <a href={details.website} target="_blank">{details.website}</a>
                                    </p>
                                }
                            </Col>
                            <Col xs="12" md="4" className="small">
                                {(details.phone != '') &&
                                <p>
                                    <span className="font-weight-bold">{t('Phone')}</span><br/>
                                    <a href={"tel:" + details.phone}>{ details.phone }</a>
                                </p>
                                }
                            </Col>
                            <Col xs="12" md="4" className="small">
                                {(details.email != '') &&
                                <p>
                                    <span className="font-weight-bold">{t('Email')}</span><br/>
                                    <a href={"mailto:" + details.email }>{ details.email }</a>
                                </p>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" className="small">
                                <p>
                                    <span className="font-weight-bold">{t('Where is this service available ?')}</span><br />
                                    <DeliversToList {...details} />
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                }

                <Row>
                    <Col>
                        <ButtonGroup size="sm" className="flex-wrap">
                            <a className="btn btn-outline-sh" href="#" onClick={ setExpandedHandler }>
                                { expanded ? (
                                <span><FontAwesomeIcon icon={ faMinusSquare } className="mr-1" />{t('Less')}</span>
                                ) : (
                                <span><FontAwesomeIcon icon={ faPlusSquare } className="mr-1" />{t('More')}</span>
                                )}
                            </a>
                            { (props.website != '') &&
                            <a className="btn btn-outline-sh" href={ props.website } target="_blank">
                                <FontAwesomeIcon icon={ faLink } className="mr-1" />{t('Website')}
                            </a>
                            }
                            { (new_phone) &&
                            <a className="btn btn-outline-sh" href={ "tel:" + props.phone }>
                                <FontAwesomeIcon icon={ faPhone } className="mr-1" />{new_phone}
                            </a>
                            }
                        </ButtonGroup>
                    </Col>

                    { expanded &&
                    <Col xs="1" lg="4" className="small pt-1 pr-2">
                        <p className="m-0 p-0">
                            <a className="small d-flex flex-nowrap justify-content-end" href="#" onClick={ reportIssue }>
                                <BugReportIcon fontSize="small" className="mr-lg-1" />
                                <span className="d-none d-lg-block">{t('Report an issue')}</span>
                            </a>
                        </p>
                    </Col>
                    }
                    
                </Row>
            </div>
        </div>
    )

}

export {
    Card
}