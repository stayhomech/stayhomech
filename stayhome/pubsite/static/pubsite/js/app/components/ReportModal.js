import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Form, Input, ModalFooter, Button, InputGroup, FormGroup, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ReportModal = props => {

    const { t, i18n } = useTranslation();

    const [modal, setModal] = useState(true)
    const [reportType, setReportType] = useState('0')
    const [reportDetails, setReportDetails] = useState('')
    const [sent, setSent] = useState(false);

    const toggle = () => setModal(!modal);

    const changeReportType = (e) => {
        setReportType(e.target.value);
    }
    const changeReportDetails = (e) => {
        setReportDetails(e.target.value);
    }

    const report = (e) => {

        e.preventDefault();

        const types = {
            '1': 'Bad information',
            '2': 'Bad delivery perimeter',
            '3': 'Other'
        }

        if (reportType == '0') {
            return window.alert('Please select an issue...');
        }

        if ((reportType == '1' || reportType == '3') && reportDetails == '') {
            return window.alert('Please add some details in the dedicated field.');
        }

        const form = new FormData();
        form.set('csrfmiddlewaretoken', props.csrf_token);
        form.set('name', 'Report form on stayhome.ch');
        form.set('email', 'info@stayhome.ch');
        form.set('message', JSON.stringify({
            business: props.business,
            npa: props.npa,
            type: types[reportType],
            message: reportDetails
        }));

        axios.post(
            '/about/',
            form,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        ).then(setSent(true))

    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                <FontAwesomeIcon icon={faBug} className="mr-2"></FontAwesomeIcon>
                {t('Report an issue')}
            </ModalHeader>
            { (!sent) ? (
                <>
                <ModalBody>
                    <Form>
                        <p className="font-weight-bold">{t('Damn... despite our efforts you found an issue...')}</p>
                        <p>{t('Can you help us by describing what the problem is ?')}</p>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="reportType" value="1" required={true} onChange={changeReportType} />{' '}
                                Wrong or missing information. Please enter details in the field below.
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="reportType" value="2" required={true} onChange={changeReportType} />{' '}
                                This service does not deliver to my place !
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="reportType" value="3" required={true} onChange={changeReportType} />{' '}
                                Other. Please enter details in the field below.
                            </Label>
                        </FormGroup>
                        <Input type="textarea" name="reportDetails" rows="5" onChange={changeReportDetails} placeholder="Enter any detail you want to add..."></Input>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" outline={true} size="sm" onClick={toggle}>Cancel</Button>
                    <Button color="sh" size="sm" onClick={report}>Report</Button>
                </ModalFooter>
                </>
            ) : (
                <>
                <ModalBody>
                    <p>Your report has been sent. Thank you!</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="sh" size="sm" onClick={toggle}>Close</Button>
                </ModalFooter>
                </>
            )}
        </Modal>
    )

}

export {
    ReportModal
}