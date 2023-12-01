import {COMPLAINTS_EVENTS} from '../../lib/constansts.js';
import {Api, handleStatuses} from '../../lib/api.js';

export class ComplainsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(COMPLAINTS_EVENTS.GET_COMPLAINT, this.getComplaintWithUser.bind(this));
        this.eventBus.on(COMPLAINTS_EVENTS.ACCEPT_COMPLAINT, this.acceptComplaint.bind(this));
        this.eventBus.on(COMPLAINTS_EVENTS.DECLINE_COMPLAINT, this.declineComplaint.bind(this));
    }

    getComplaintWithUser() {
        Api.getComplaint().then(handleStatuses((complaintR) => {
            if (complaintR.status === 200) {
                Api.getUser(complaintR.payload.reported_user_id).then(handleStatuses((userR) => {
                    complaintR.payload.user = userR.payload;
                    this.eventBus.emit(COMPLAINTS_EVENTS.COMPLAINT_READY, complaintR.payload);
                },
                this.eventBus),
                );
            } else if (complaintR.status === 404) {
                const data = {noComplains: 1};
                this.eventBus.emit(COMPLAINTS_EVENTS.COMPLAINT_READY, data);
            }
        },
        this.eventBus),
        );
    }

    acceptComplaint(data) {
        Api.acceptComplaint(data).then(handleStatuses(()=> {
            this.getComplaintWithUser();
        },
        this.eventBus),
        );
    }

    declineComplaint(data) {
        Api.declineComplaint(data).then(handleStatuses(()=> {
            this.getComplaintWithUser();
        },
        this.eventBus),
        );
    }
}
